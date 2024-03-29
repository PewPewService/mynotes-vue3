<template>
  <div class="card note flex-card mb-4 mx-auto shadow">
    <div class="card-body">
      <span class="card-title h5 fw-bold"> {{ Note.name }} </span>

      <VConfirm ref="popup" />

      <VImageCarousel
        class="mt-1 mb-1"
        :Id="Note.id"
        :Images="Note.images"
        :Delete="false"
      />

      <p class="card-text mx-auto">
        {{ Note.text }}
      </p>

      <div class="note__management-buttons">
        <button
          :class="
            `btn btn-secondary note__management-buttons__button
             note__management-buttons__button_pin`.concat(
              Note.pinned ? ' note__management-buttons__button_unpin' : ''
            )
          "
          :title="Note.pinned ? 'unpin' : 'pin'"
          @click="PinNote(Note.id)"
        />
        <button
          class="
            btn btn-secondary
            note__management-buttons__button
            note__management-buttons__button_edit
          "
          title="edit"
          @click="EditNote(Note.id)"
        />
        <button
          class="
            btn btn-secondary
            note__management-buttons__button
            note__management-buttons__button_copy
          "
          title="copy"
          @click="CopyNote(Note.id, Note.pinned)"
        />
        <button
          class="
            btn btn-secondary
            note__management-buttons__button
            note__management-buttons__button_delete
          "
          title="delete"
          @click="DeleteNote(Note.id)"
        />
      </div>

      <div
        :hidden="!Note.tags || !Note.tags.length"
        class="note-tags-field mx-auto"
      >
        <span
          v-for="tag in Note.tags"
          :key="tag"
          class="note-tag cursor-pointer ms-1 me-1"
          @click="SearchByTag(tag)"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import This from "../../utils/interfaces/this";
import { mapActions } from "vuex";
import { moduleName, actionTypes } from "../../store/modules/notes";
import VImageCarousel from "../VImageCarousel.vue";
import VConfirm from "../VConfirm.vue";
import { defineComponent } from "@vue/runtime-core";
export default defineComponent({
  name: "VNoteCard",
  components: {
    VImageCarousel,
    VConfirm,
  },
  props: {
    Note: Object,
  },
  methods: {
    ...mapActions(moduleName, [
      actionTypes.ACTION_PIN_NOTE,
      actionTypes.ACTION_COPY_NOTE,
      actionTypes.ACTION_DELETE_NOTE,
    ]),

    async PinNote(this: This, id: number): Promise<void> {
      await this[actionTypes.ACTION_PIN_NOTE](id);
      this.$emit("PopUpMessage");
      this.$emit("CheckEmptyPage");
    },

    EditNote(id: number) {
      this.$router.push({
        name: "NoteEditing",
        query: { id },
      });
    },

    async CopyNote(this: This, id: Number, pinned: boolean): Promise<void> {
      await this[actionTypes.ACTION_COPY_NOTE](id);
      this.$emit("PopUpMessage");
      this.$emit("Refresh", pinned);
    },

    async DeleteNote(this: This, id: number): Promise<void> {
      let confirmation = await this.$refs.popup.show(
        "Are you sure you want to delete this note?"
      );
      if (confirmation) {
        await this[actionTypes.ACTION_DELETE_NOTE](id);
        this.$emit("PopUpMessage");
        this.$emit("CheckEmptyPage");
      }
    },

    SearchByTag(tag: string): void {
      this.$router.push({ name: "Search", query: { search: tag } });
    },
  },
});
</script>

<style lang="scss" scoped>
@media (max-width: 699px) {
  .flex-card {
    @include flexcard(80%);
  }
}

@media (min-width: 700px) {
  .flex-card {
    @include flexcard(40%);
  }
}

.note__management-buttons {
  height: 2rem;
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
}

.note__management-buttons__button {
  @include basic-button();
  margin-left: 0.5rem;
  &:hover {
    background-color: $global-color;
  }
}

.note-tags-field {
  white-space: nowrap;
  overflow: scroll;
  width: 90%;
  height: 2rem;
  position: absolute;
  left: 0%;
  margin-left: 5% !important;
  bottom: 3rem;
  &::-webkit-scrollbar {
    display: none;
  }
}

.note-tag {
  background-color: gray;
  color: white;
  height: 1rem;
  line-height: 1rem;
  border-radius: 1rem;
  padding: 0 0.2rem 0 0.2rem;
  text-align: right;
  &:hover {
    background-color: $global-color;
    color: black;
  }
}

.note__management-buttons__button_pin {
  background-image: url($pin_icon);
}
.note__management-buttons__button_edit {
  background-image: url($edit_icon);
}
.note__management-buttons__button_copy {
  background-image: url($copy_icon);
}
.note__management-buttons__button_delete {
  background-image: url($delete_icon);
  &:hover {
    background-color: $global-error;
  }
}
.note__management-buttons__button_unpin:hover {
  background-color: $global-error;
}
</style>
