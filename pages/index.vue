<template>
	<section class="flex items-center justify-between mb-10">
		<h1 class="text-4xl font-extrabold">Summary</h1>
		<USelectMenu :options="transactionViewOptions" v-model="selectedView" />
	</section>
</template>

<script setup>
import { transactionViewOptions } from '~/constants'
const selectedView = ref(transactionViewOptions[1])
</script>

<style lang="scss" scoped></style>
