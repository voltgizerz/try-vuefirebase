<template>
  <v-data-table
    :headers="headers"
    :items="minumans"
    :search="search"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Kedai Uncle Muthu</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field
          v-model="search"
          append-icon="mdi-account-search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <template v-if="selected.length > 0">
          <v-btn
            color="red"
            dark
            class="mb-2 mr-3"
            @click="deleteitemBox()"
          >Delete {{selected.length}}</v-btn>
        </template>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">buat minuman</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.name" label="Minuman name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      :items="items"
                      label="Calories (g)"
                      v-model="editedItem.calories"
                      outline
                      autocomplete
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.fat" label="Fat (g)"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.carbs" label="Carbs (g)"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.protein" label="Protein (g)"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.checkbox="{ item }">
      <v-checkbox></v-checkbox>
    </template>
    <template v-slot:item.checkbox="{ item }">
      <v-checkbox :value="item" v-model="selected"></v-checkbox>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon @click="edititem(item)" class="mr-1">mdi-silverware</v-icon>
      <v-icon @click="deleteitem(item)" class="mr-1">mdi-delete</v-icon>
    </template>
    <v-alert
      slot="no-results"
      :value="true"
      color="error"
      icon="mdi-run"
    >Your search for "{{ search }}" found no results.</v-alert>
  </v-data-table>
</template>
<script>
import { minumansRef } from "../firebase";

export default {
  data: () => ({
    selected: [],
    items: [
      { text: "Dingin", value: "Dingin" },
      { text: "Hangat", value: "Hangat" }
    ],
    cek: -1,
    dialog: false,
    search: "",
    headers: [
      {
        text: "Dessert (100g serving)",
        align: "left",
        sortable: false,
        value: "name"
      },
      { text: "Calories", value: "calories" },
      { text: "Fat (g)", value: "fat" },
      { text: "Carbs (g)", value: "carbs" },
      { text: "Protein (g)", value: "protein" },
      { text: "#", value: "checkbox" },
      { text: "Actions", value: "action", sortable: false }
    ],
    minumans: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    },
    defaultItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    }
  }),
  firebase: {
    minumans: minumansRef
  },
  computed: {
    formTitle() {
      return this.cek === -1 ? "New Item" : "Edit Item";
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  methods: {
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    clear() {
      this.editedItem = {};
      this.editedItem.name = "";
      this.editedItem.calories = 0;
      this.editedItem.fat = 0;
      this.editedItem.carbs = 0;
      this.editedItem.protein = 0;
      this.cek = -1;
    },
    // methods untuk save
    save() {
      if (this.cek > -1) {
        minumansRef.child(this.editedIndex).set({
          name: this.editedItem.name,
          calories: this.editedItem.calories,
          fat: this.editedItem.fat,
          carbs: this.editedItem.carbs,
          protein: this.editedItem.protein
        });
        this.clear();
      } else {
        minumansRef.push({
          name: this.editedItem.name,
          calories: this.editedItem.calories,
          fat: this.editedItem.fat,
          carbs: this.editedItem.carbs,
          protein: this.editedItem.protein
        });
        this.clear();
      }
      this.selected = [];
      this.close();
    },
    edititem(item) {
      this.editedIndex = item[".key"];
      this.cek = 0;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteitem(item) {
      confirm("Are you sure you want to delete this item?") &&
        minumansRef.child(item[".key"]).remove();
    },
    deleteitemBox() {
      if (this.selected.length > 0) {
        if (this.selected.length == 1) {
          confirm("Are you sure you want to delete this item?") &&
            minumansRef.child(this.selected[0][".key"]).remove();
          this.selected = [];
        } else {
          if (confirm("Are you sure you want to delete all this item?")) {
            for (this.i = 0; this.i < this.selected.length; this.i++) {
              minumansRef.child(this.selected[this.i][".key"]).remove();
            }
            this.selected = [];
          } else {
            this.selected = [];
          }
        }
      }
    }
  }
};
</script>