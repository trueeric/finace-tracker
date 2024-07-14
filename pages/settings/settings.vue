<template>
	<UForm :state="state" :schema="schema" @submit="saveSettings">
		<UFormGroup class="mb-4" label="Transaction view" help="Choose how you would like to view">
			<USelect v-model="state.transactionView" :options="transactionViewOptions" />
		</UFormGroup>

		<UButton type="submit" color="black" variant="solid" label="Save" :loading="pending" :disabled="pending" />
	</UForm>
</template>

<script setup>
import { z } from 'zod'
import { transactionViewOptions } from '~/constants'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const { toastSuccess, toastError } = useAppToast()
const pending = ref(false)

const state = ref({
	// * 先看有沒有值，沒值預設為transactionViewOptions[1](monthly)
	transactionView: user.value.user_metadata?.transaction_view ?? transactionViewOptions[1],
})

const schema = z.object({
	transactionView: z.enum(transactionViewOptions),
})

const saveSettings = async () => {
	pending.value = true

	try {
		const data = {
			data: {
				transaction_view: state.value.transactionView,
			},
		}

		const { error } = await supabase.auth.updateUser(data)
		if (error) throw error
		toastSuccess({
			title: 'Settings updated.',
			description: 'Your settings has been updated.',
		})
	} catch (error) {
		toastError({
			title: 'Error updating profile',
			description: error.message,
		})
	} finally {
		pending.value = false
	}
}
</script>

<style lang="scss" scoped></style>
