<template>
	<UModal v-model="isOpen">
		<UCard>
			<template #header> Add transaction </template>
		</UCard>
		<UFormGroup
			label="Transaction Type"
			:required="true"
			name="type"
			placeholder="Select transaction type"
			class="mb-4"
		>
			<USelect placeholder="type" :options="types" />
		</UFormGroup>
		<UFormGroup label="Amount" :required="true" name="amount" class="mb-4">
			<UInput type="number" placeholder="Amount" />
		</UFormGroup>
		<UFormGroup label="Transaction date" :required="true" name="created_at" class="mb-4">
			<UInput type="date" icon="i-heroicons-calendar-days-20-solid" />
		</UFormGroup>
		<UFormGroup label="Description" hint="optional" name="description" class="mb-4">
			<UInput placeholder="description" />
		</UFormGroup>
		<UFormGroup :required="true" label="Category" name="category" class="mb-4">
			<USelect placeholder="category" :options="categories" />
		</UFormGroup>
		<UButton type="submit" color="black" variant="solid" label="save" block />
	</UModal>
</template>

<script setup>
import { categories, types } from '~/constants'
const props = defineProps({
	modalValue: Boolean,
})

const emit = defineEmits('update:modelValue')

const isOpen = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
})
</script>

<style scoped></style>
