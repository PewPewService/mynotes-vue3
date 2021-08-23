<template>
  <div class="card note flex-card mb-4 mx-auto">
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
          :id="Note.id"
          :class="
            `btn btn-secondary note__management-buttons__button
             note__management-buttons__button_pin`.concat(
              Note.pinned ? ' note__management-buttons__button_unpin' : ''
            )
          "
          :title="Note.pinned ? 'unpin' : 'pin'"
          @click="PinNote"
        />
        <button
          :id="Note.id"
          class="
            btn btn-secondary
            note__management-buttons__button
            note__management-buttons__button_edit
          "
          title="edit"
          @click="EditNote"
        />
        <button
          :id="Note.id"
          class="
            btn btn-secondary
            note__management-buttons__button
            note__management-buttons__button_copy
          "
          title="copy"
          @click="CopyNote"
        />
        <button
          :id="Note.id"
          class="
            btn btn-secondary
            note__management-buttons__button
            note__management-buttons__button_delete
          "
          title="delete"
          @click="DeleteNote"
        />
      </div>

      <div
        :hidden="!Note.tags || !Note.tags.length"
        class="note-tags-field mx-auto"
      >
        <span
          v-for="tag in Note.tags"
          :key="tag"
          class="note-tag ms-1 me-1"
          @click="SearchByTag(tag)"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { moduleName, actionTypes, getterTypes } from "../../store/modules/notes";
import VImageCarousel from "../VImageCarousel.vue";
import VConfirm from "../VConfirm.vue";
export default {
  name: "VNoteCard",
  components: {
    VImageCarousel,
    VConfirm,
  },
  props: {
    Note: Object,
  },
  computed: {
    ...mapGetters(moduleName, [getterTypes.GETTER_CONNECTION_STRING]),
  },
  methods: {
    ...mapActions(moduleName, [
      actionTypes.ACTION_PIN_NOTE,
      actionTypes.ACTION_COPY_NOTE,
      actionTypes.ACTION_DELETE_NOTE,
    ]),

    connectionString(image) {
      return this[getterTypes.GETTER_CONNECTION_STRING] + image;
    },

    async ConfirmAction(message) {
      return await this.$bvModal.msgBoxConfirm(message).then((value) => {
        return value;
      });
    },

    async PinNote(event) {
      await this[actionTypes.ACTION_PIN_NOTE](event.target.id);
      this.$emit("PopUpMessage");
      this.$emit("CheckEmptyPage");
    },

    EditNote(event) {
      this.$router.push({
        name: "NoteEditing",
        query: { id: event.target.id },
      });
    },

    async CopyNote(event) {
      await this[actionTypes.ACTION_COPY_NOTE](event.target.id);
      this.$emit("PopUpMessage");
      this.$emit("refresh");
    },

    async DeleteNote(event) {
      let confirmation = await this.$refs.popup.show(
        "Are you sure you want to delete this note?"
      );
      if (confirmation) {
        await this[actionTypes.ACTION_DELETE_NOTE](event.target.id);
        this.$emit("PopUpMessage");
        this.$emit("CheckEmptyPage");
      }
    },

    SearchByTag(tag) {
      this.$router.push({ name: "Search", query: { search: tag } });
      this.$emit("refresh");
    },
  },
};
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
  cursor: pointer;
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
