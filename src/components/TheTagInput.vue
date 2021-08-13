<!-- eslint-disable prettier/prettier -->
<template>
    <div class="w-100 tag-input form-control">
        <div
            v-for="(tag, index) in Tags"
            :key="index"
            class="tag-input__tag"
        >
            <span @click="deleteTag(index)">x</span>
            {{ tag }}
        </div>
        <input
            type="text"
            placeholder="Enter a tag"
            class="tag-input__text"
            @keydown.space="addTag"
            @keydown.enter="addTag"
            @keydown.delete="popTag"
        >
    </div>
</template>

<script>
/* eslint-disable prettier/prettier */
/* eslint-disable vue/no-mutating-props */
export default {
    name: "TheTagInput",
    props: {
        Tags: Array
    },
    methods: {
        addTag(event) {
            event.preventDefault();
            let tag = event.target.value.trim();
            if (tag && this.Tags.indexOf(tag) == -1) {
                this.Tags.push(tag);
                event.target.value = "";
            }
        },

        deleteTag(index) {
            this.Tags.splice(index, 1);
        },

        popTag(event) {
            let tag = event.target.value.trim();
            if (!tag && this.Tags.length) {
            event.preventDefault();
                this.Tags.pop();
            }
        }
    }
}
</script>

<style scoped>
.tag-input {
    border: 1px solid #eee;
    font-size: 0.9em;
    box-sizing: border-box;
    padding: 0 10px;
    cursor: default;
}

.tag-input__tag {
    height: 30px;
    float: left;
    margin-right: 10px;
    background-color: #eee;
    margin-top: 10px;
    line-height: 30px;
    padding: 0 5px;
    border-radius: 5px;
}

.tag-input__tag > span {
    cursor: pointer;
    opacity: 0.75;
}

.tag-input__text {
    float: left;
    border: none;
    outline: none;
    font-size: 0.9em;
    line-height: 50px;
    background: none;
}
</style>