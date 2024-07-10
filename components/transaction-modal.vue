<template>
	<UModal v-model="isOpen">
		<UCard>
			<template #header> Add transaction </template>
		</UCard>
		<UForm :state="state" :schema="schema" ref="form" @submit="save">
			<UFormGroup
				label="Transaction Type"
				:required="true"
				name="type"
				placeholder="Select transaction type"
				class="mb-4"
			>
				<USelect placeholder="type" :options="types" v-model="state.type" />
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
})
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
		const { error } = await supabase.from('transactions').upsert({ ...state.value })

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
const state = ref({
	...initialState,
})

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
