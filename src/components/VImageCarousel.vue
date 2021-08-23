<template>
    <div
        v-if="Images && Images.length > 0"
        :id="'carousel' + Id"
        class="w-100 mx-auto carousel"
        data-bs-ride="carousel"
        data-bs-interval="false"
    >
        <div class="carousel-inner">
            <div
                v-for="(image, index) in Images"
                :key="index"
                :class="'carousel-item' + (index == displayedImage ? ' active' : '')"
                data-bs-interval="false"
            >
                <img 
                    :src="connectionString(image)"
                    class="d-block carousel-slide"
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
            @click="NextSlide"
        >
            <span class="carousel-control-prev-icon"/>
        </button>
        <button 
            v-if="Images.length > 1"
            class="carousel-control-next"
            type="button"
            @click="PrevSlide"
        >
            <span class="carousel-control-next-icon"/>
        </button>
        
        <VConfirm ref="popup" />
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getterTypes, moduleName } from "../store/modules/notes";
import VConfirm from "./VConfirm.vue";
export default {
    name: "VImageCarousel",

    components: {
        VConfirm,
    },

    props: {
        Id: Number,
        Images: Array,
        DeletedImages: Array,
        Delete: Boolean
    },

    data() {
        return {
            displayedImage: 0
        }
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

        async DeleteImage(index) {
            let confirmation = await
                this.$refs.popup.show("Are you sure you want to delete this image?");
            if (confirmation) {
                this.$emit("DeleteImage", index);
                if (this.displayedImage >= this.Images.length - 1) this.displayedImage = this.Images.length - 1;
            }
        },

        NextSlide() {
            if (this.displayedImage >= this.Images.length - 1) {
                this.displayedImage = 0;
            } else {
                this.displayedImage += 1;
            }
        },

        PrevSlide() {
            if (this.displayedImage <= 0) {
                this.displayedImage = this.Images.length - 1;
            } else {
                this.displayedImage -= 1;
            }
        },
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
    height: 20rem !important;
}
</style>