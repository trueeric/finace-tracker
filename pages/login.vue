<template>
	<UCard v-if="!success">
		<template #header> Sign-in to Finance Tracter </template>
		<form>
			<UFormGroup
				label="emil"
				name="email"
				class="mb-4"
				:required="true"
				help="You will receieve an email with the confirmation link."
			>
				<UInput type="email" placeholder="Email" required />
				<UButton type="submit" variant="solid" color="black" @click="success = true">Sign-in</UButton>
			</UFormGroup>
		</form>
	</UCard>
	<UCard v-else>
		<template #header> Email has been sent. </template>
		<div class="text-center">
			<p class="mb-4">We have sent an email to <strong>rmsil@emil.com</strong> with a link to sign-in.</p>
			<p><strong>Important:</strong> The link will expire in 5 minutes.</p>
		</div>
	</UCard>
</template>

<script setup>
const success = ref(false)
</script>
