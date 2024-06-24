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
				<UIcon :name="icon" class="w-6 h-6" :class="{ green: trendingUp, red: !trendingUp }" />
				<div class="text-gray-500 dark:text-gray-400">{{ percentageTrend }} vs last period</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	title: String,
	amount: Number,
	lastAmount: Number,
	color: String,
	loading: Boolean,
})

const trendingUp = computed(() => props.amount >= props.lastAmount)
const icon = computed(() => (trendingUp.value ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'))

// const percentageTrend = computed(() => {
// 	if (props.amount === 0 || props.lastAmount === 0) return '0'

// 	const bigger = Math.max(props.amount, props.lastAmount)
// 	const lower = Math.min(props.amount, props.lastAmount)

// 	const ratio = ((bigger - lower) / lower) * 100
// 	console.log(bigger, lower, ratio, Math.ceil(ratio))
// 	return ratio
// })

const percentageTrend = computed(() => {
	if (props.amount === 0 || props.lastAmount === 0) return '0'

	const difference = props.amount - props.lastAmount
	const ratio = (difference / props.lastAmount) * 100
	// console.log('ratio', Math.ceil(ratio))

	return `${Math.round(ratio * 10) / 10}%`
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
