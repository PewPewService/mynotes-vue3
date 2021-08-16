<!-- eslint-disable prettier/prettier -->
<template>
    <div class="p-4">
        <div
            class="spinner-border text-primary"
            role="status"
            v-if="Loading"
        />
        <div class="w-75 h-75 border shadow mx-auto my-auto p-4">
            <p class="mt-3 w-75 text mx-auto fw-bold h2 mb-5">
                {{ FoundNote.id ? 'Edit the note' : 'Add a note' }}
            </p>
            <form @submit="CreateForm">
                <div class="input-group mt-3 w-75 text mx-auto text-left fw-bold">
                    <span>Name of the note:</span>
                    <input
                        v-model="FoundNote.name"
                        placeholder="Enter the name of the note here"
                        type="text"
                        class="form-control w-100 mx-auto"
                        required
                        trim
                    />
                </div>
                <div class="input-group mt-3 w-75 text mx-auto text-left fw-bold">
                    <span>Text:</span>
                    <textarea
                        v-model="FoundNote.text"
                        placeholder="And text here"
                        class="form-control w-100 mx-auto"
                        trim
                    />
                </div>
                <div class="input-group mt-3 w-75 text mx-auto text-left fw-bold">
                    <span>Images:</span>
                    <VImageCarousel
                        class="mt-2 mb-3"
                        :Images="FoundNote.images"
                        :DeletedImages="deletedImages"
                        :Delete="true"
                        @DeleteImage="DeleteImage"
                    />

                    <div class="w-100 mx-auto">
                        <div class="input-group">
                                <input
                                    id="NoteImages" 
                                    type="file"
                                    multiple
                                    class="form-control custom-file-input cursor-pointer"
                                    ref="NoteImages"
                                    aria-describedby="NoteImages"
                                    accept='image/jpg, image/jpeg, image/png'
                                >
                        </div>
                    </div>
                </div>
                <div class="input-group mt-3 w-75 text mx-auto text-left fw-bold">
                    <span>Tags:</span>
                    <TheTagInput 
                        :Tags="FoundNote.tags"
                        @UpdateTags="(tags) => FoundNote.tags = tags"    
                    />

                </div>

                <input
                    type="submit"
                    class="btn btn-primary w-75 mx-auto mt-3 mb-5"
                    :value="FoundNote.id ? 'Edit' : 'Add' "
                >  
            </form>


            
            <p>
                <span class="mt-3 mb-5 input_error">
                    {{NoteResponseError.data}}
                </span>
                <span class="mt-3 mb-5 input_success">
                    {{NoteResponseSuccess.data}}
                </span>
            </p>
        </div>
    </div>
</template>

<script>
/* eslint-disable prettier/prettier */
import { mapGetters, mapActions } from 'vuex';
import { actionTypes, getterTypes, moduleName } from '../store/modules/notes';
import TheTagInput from "./TheTagInput.vue";
import VImageCarousel from "./VImageCarousel.vue";

export default {
    name: "TheNoteEditingPage",
    components: {
        TheTagInput,
        VImageCarousel
    },

    data() {
        return {
            tag: '',
            images: [],
            deletedImages: [],
            Loading: false,
        }
    },
    
    computed: {
        ...mapGetters(moduleName, [
            getterTypes.GETTER_NOTE_RESPONSE_ERROR,
            getterTypes.GETTER_NOTE_RESPONSE_SUCCESS,
            getterTypes.GETTER_EDITING_NOTE,
            getterTypes.GETTER_CONNECTION_STRING,
        ]),
        NoteResponseError(){
            return this[getterTypes.GETTER_NOTE_RESPONSE_ERROR];
        },
        NoteResponseSuccess(){
            return this[getterTypes.GETTER_NOTE_RESPONSE_SUCCESS];
        },
        FoundNote(){
            return this[getterTypes.GETTER_EDITING_NOTE]
        },
    },

    methods: {
        ...mapActions(moduleName, [
            actionTypes.ACTION_ADD_NOTE,
            actionTypes.ACTION_GET_NOTE,
            actionTypes.ACTION_EDIT_NOTE
        ]),

        async setFoundNote(){
            let id = this.$route.query.id;
            await this[actionTypes.ACTION_GET_NOTE] (id ? id : 0);
        },
        
        async ConfirmAction(message){
            return await this.$bvModal.msgBoxConfirm(message)
            .then(value => {
                return value;
            })
        },

        async DeleteImage(id){
            console.log(id);
            //if ( await this.ConfirmAction('Are you sure you want to delete this image?') ){
                this.deletedImages.push(this.FoundNote.images[id]);
                this.FoundNote.images.splice(id,1);
                console.log(this.FoundNote.images);
           // }
        },

        async AddOrEditNote(form){
            if (this.FoundNote.id) {
                await this[actionTypes.ACTION_EDIT_NOTE] (form);
            }
            else await this[actionTypes.ACTION_ADD_NOTE] (form);
            if (this[getterTypes.GETTER_NOTE_RESPONSE_SUCCESS]) {
                this.$router.push({name: 'Home'});
            }
            this.Loading = false;
        },

        CreateForm(event) {
            event.preventDefault();
            let images = this.$refs.NoteImages.files;
            let form = new FormData;
            form.append('id', this.FoundNote.id);
            form.append('name', this.FoundNote.name);
            form.append('text', this.FoundNote.text);
            for (let tag of this.FoundNote.tags){
                form.append('tags', tag); 
            }
            for (let image of images) {
                form.append('images', image);
            }
            if (this.FoundNote.id){
                form.append('leftImages', this.FoundNote.images);
                form.append('deletedImages', this.deletedImages);
                form.append('pinned', this.FoundNote.pinned);
            }
            this.Loading = true;
            this.AddOrEditNote(form);
        },
        connectionString(image){
            return this[getterTypes.GETTER_CONNECTION_STRING] + image;
        },
    },
    
    async mounted(){
        await this.setFoundNote();
    },
}
</script>

<style lang="scss" scoped>
.delete-image-button{
    @include basic-button();
    background-image: url($delete_icon);
    background-color: $global-error;
}

.custom-file-input.selected:lang(en)::after{
  content: "" !important;
}

.custom-file{
  overflow: hidden;
}

.custom-file-input{
  white-space: nowrap;
}
</style>