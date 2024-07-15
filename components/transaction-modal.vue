<template>
	<UModal v-model="isOpen">
		<UCard>
			<template #header> {{ isEditing ? 'Edit' : 'Add' }} transaction </template>
		</UCard>
		<UForm :state="state" :schema="schema" ref="form" @submit="save">
			<UFormGroup
				label="Transaction Type"
				:required="true"
				name="type"
				placeholder="Select transaction type"
				class="mb-4"
			>
				<USelect
					:disabled="isEditing"
					placeholder="Select the transaction type"
					:options="types"
					v-model="state.type"
				/>
			</UFormGroup>
			<UFormGroup label="Amount" :required="true" name="amount" class="mb-4">
				<UInput type="number" placeholder="Amount" v-model.number="state.amount" />
			</UFormGroup>
			<UFormGroup label="Transaction date" :required="true" name="created_at" class="mb-4">
				<UInput type="date" icon="i-heroicons-calendar-days-20-solid" v-model="state.created_at" />
			</UFormGroup>
			<UFormGroup label="Description" hint="optional" name="description" class="mb-4">
				<UInput placeholder="description" v-model="state.description" />
			</UFormGroup>
			<UFormGroup :required="true" label="Category" name="category" class="mb-4" v-if="state.type === 'Expense'">
				<USelect placeholder="category" :options="categories" v-model="state.category" />
			</UFormGroup>
			<UButton type="submit" color="black" variant="solid" label="save" block :loading="isLoading" />
		</UForm>
	</UModal>
</template>

<script setup>
import { categories, types } from '~/constants'
import { z } from 'zod'

const props = defineProps({
	modelValue: Boolean,
	transaction: {
		type: Object,
		required: false,
	},
})

/*  雙驚嘆號(!!)並不單純是在這樣用的，它是為了要轉換一些可以形成布林值的情況值，列出如下:
false: 0, -0, null, false, NaN, undefined, ''(空白字串)
true: 不是 false 的其他情況
*/
const isEditing = computed(() => !!props.transaction)

// ! defineEmits 需要用[]包起來
const emit = defineEmits(['update:modelValue', 'saved'])

const defaultSchema = z.object({
	amount: z.number().positive('Amount needs to be more than 0!'),
	created_at: z.string(),
	description: z.string().optional(),
})

const incomeSchema = z.object({
	type: z.literal('Income'),
})

// * 如果 type 為 expense, category為必填欄位
const expenseSchema = z.object({
	type: z.literal('Expense'),
	category: z.enum(categories),
})

const investmentSchema = z.object({
	type: z.literal('Investment'),
})

const savingSchema = z.object({
	type: z.literal('Saving'),
})
// * 把incomeSchema, expenseSchma, investmentSchema, savingSchema都納入驗證規則
const schema = z.intersection(
	z.discriminatedUnion('type', [incomeSchema, expenseSchema, investmentSchema, savingSchema]),
	defaultSchema
)

const form = ref()
const isLoading = ref(false)
const supabase = useSupabaseClient()
// const toast = useAppToast()
const { toastSuccess, toastError } = useAppToast()

const save = async () => {
	if (form.value.errors.length) return

	isLoading.value = true
	try {
		// ! '...'spread的語法注意要用物件{}
		// * upsert 有 insert 及 update的功能，要判斷有無id
		const { error } = await supabase.from('transactions').upsert({
			...state.value,
			id: props.transaction?.id,
		})

		if (!error) {
			toastSuccess({
				title: 'Transaction saved',
				icon: 'i-i-heroicons-check-circle',
				color: 'red',
			})
			isOpen.value = false
			emit('saved')
			return
		}
		throw error
	} catch (e) {
		toastError({
			title: 'Transaction NOT saved',
			description: e.message,
		})
	} finally {
		isLoading.value = false
	}
}

// * 新增表單預設值
const initialState = {
	type: undefined,
	amount: 0,
	created_at: undefined,
	description: undefined,
	category: undefined,
}
// * 編輯或新增
const state = ref(
	isEditing.value
		? {
				type: props.transaction.type,
				amount: props.transaction.amount,
				created_at: props.transaction.created_at.split('T')[0],
				description: props.transaction.description,
				category: props.transaction.category,
		  }
		: { ...initialState }
)

const resetForm = () => {
	Object.assign(state.value, initialState)
	form.value.clear()
}

const isOpen = computed({
	get: () => props.modelValue,
	set: (value) => {
		if (!value) resetForm()
		emit('update:modelValue', value)
	},
})
</script>
