<template>
    <div class="text-center card daiteap-content-card">
        <h2>
            Unsubscribe Successful
        </h2>
        <div class="mt-5">
            <div>
                You have been successfully unsubscribed from email communications.
            </div>
            <div>
                If you did this in error, you may re-subscribe by clicking the button below.
            </div>
        </div>
        <div class="mt-5">
            <div class="custom-button m-auto" @click="subscribe()">
                Re-subscribe
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Unsubscribe",
    mounted() {
        this.emailUnsubscribe();
    },
    methods: {
        subscribe() {
            this.emailSubscribe();
            this.$router.push({ name: 'DaiteapWebLandingPage' });
        }
    }
};
</script>
