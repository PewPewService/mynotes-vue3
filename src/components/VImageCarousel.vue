<!-- eslint-disable prettier/prettier -->
<template>
    <div
        v-if="Images && Images.length > 0"
        :id="'carousel'+Id"
        class="w-100 mx-auto carousel slide mb-3"
        data-bs-ride="carousel"
        data-bs-interval="false"
    >
        <div class="carousel-inner">
            <div
                v-for="(image, index) in Images"
                :key="index"
                :class="'carousel-item' + (index == 0 ? ' active' : '')"
                data-bs-interval="false"
            >
                <img 
                    :src="connectionString(image)"
                    class="d-block carousel-slide mx-auto my-auto"
                >
                <input
                    v-if="Delete"
                    type="button"
                    class="btn delete-image-button"
                    @click="DeleteImage(index)"
                >
            </div>
        </div>
        <button
            v-if="Images.length > 1"
            class="carousel-control-prev"
            type="button"
            :data-bs-target="'#carousel'+Id"
            data-bs-slide="prev"
        >
            <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
            />
            <span class="visually-hidden">Previous</span>
        </button>
        <button 
            v-if="Images.length > 1"
            class="carousel-control-next"
            type="button"
            :data-bs-target="'#carousel'+Id"
            data-bs-slide="next"
        >
            <span
                class="carousel-control-next-icon"
                aria-hidden="true"
            />
            <span class="visually-hidden">Next</span>
        </button>
    </div>
</template>

<script>
/* eslint-disable prettier/prettier */
import "bootstrap/dist/js/bootstrap.min.js";
import { mapGetters } from "vuex";
import { getterTypes, moduleName } from "../store/modules/notes";
export default {
    name: "VImageCarousel",

    props: {
        Id: Number,
        Images: Array,
        DeletedImages: Array,
        Delete: Boolean
    },

    computed: {
        ...mapGetters(moduleName,[
            getterTypes.GETTER_CONNECTION_STRING
        ])
    },

    methods:{
        connectionString(image) {
            return this[getterTypes.GETTER_CONNECTION_STRING] + image;
        },

        async ConfirmAction(message){
            return await this.$bvModal.msgBoxConfirm(message)
            .then(value => {
                return value;
            })
        },

        DeleteImage(index) {
            //if ( await this.ConfirmAction('Are you sure you want to delete this image?') ){
                this.$emit("DeleteImage", index);
            //}
        }
    }
}
</script>

<style lang="scss" scoped>
.delete-image-button{
    @include basic-button();
    background-image: url($delete_icon);
    background-color: $global-error;
    transform: translate(-50%, -50%);
    left: 50%;
    position: absolute !important;
    bottom: 1rem;
}
.carousel, .slide, .carousel-item{
    height: 30rem !important;
}
</style>