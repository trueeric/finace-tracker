<template>
	<div>
		<div class="font-bold" :class="[color]">{{ title }}</div>
		<div class="text-2xl fold-extrabold text-black dark:text-white mb-w">
			<USkeleton class="h-8 w-full" v-if="loading" />
			<div v-else>{{ amount }}</div>
		</div>

		<div>
			<USkeleton class="h-6 w-full" v-if="loading" />
			<div class="flex space-x-1 items-center text-sm" v-else>
				<UIcon name="i-heroicons-arrow-trending-up" class="w-6 h-6" :class="[color]" />
				<div class="text-gray-500 dark:text-gray-400">30% vs last period</div>
			</div>
		</div>
	</div>
</template>

<script setup>
defineProps({
	title: String,
	amount: Number,
	lastAmount: Number,
	color: String,
	loading: Boolean,
})
</script>

<style scoped>
.green {
	@apply text-green-600 dark:text-green-400;
}
.red {
	@apply text-red-600 dark:text-red-400;
}
</style>
