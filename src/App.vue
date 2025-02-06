<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-icon>mdi-bed</v-icon>
      <v-toolbar-title style="margin-left: 10px; font-weight: 600"
        >FS Hotel</v-toolbar-title
      >
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main class="grey lighten-4">
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-card class="elevation-3">
              <v-card-title class="headline font-weight-bold">
                FS Booking
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="dialog = true" dark>
                  <v-icon left>mdi-plus</v-icon>
                  New Booking
                </v-btn>
              </v-card-title>
              <v-dialog v-model="dialog" max-width="600px">
                <v-card>
                  <v-card-title class="headline font-weight-bold"
                    >New Booking</v-card-title
                  >
                  <v-card-text>
                    <v-form ref="form">
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="4" md="6">
                            <v-menu
                              v-model="menuStartDate"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="StartDate"
                                  label="Check-in date"
                                  append-icon="mdi-calendar"
                                  dense
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                  clearable
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="StartDate"
                                @change="menuStartDate = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>

                          <v-col cols="12" sm="4" md="6">
                            <v-menu
                              v-model="menuEndDate"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="EndDate"
                                  label="Check-out date"
                                  append-icon="mdi-calendar"
                                  dense
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                  clearable
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="EndDate"
                                @change="menuEndDate = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" sm="4" md="6">
                            <v-select
                              v-model="roomType"
                              :items="roomTypes"
                              item-text="room_type"
                              item-value="id"
                              label="Room type"
                              clearable
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="4" md="6"> </v-col>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="openbookingsummary()"
                      >SUBMIT</v-btn
                    >
                    <v-btn @click="dialog = false">CANCEL</v-btn>
                  </v-card-actions>
                </v-card>
                <v-dialog v-model="summaryDialog" max-width="500px">
                  <v-card>
                    <v-card-title class="headline font-weight-bold"
                      >Booking Summary</v-card-title
                    >
                    <v-card-text>
                      <p>Check-in Date: {{ StartDate }}</p>
                      <p>Check-out Date: {{ EndDate }}</p>
                      <p>Room Type: {{ roomdisplay }}</p>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn @click="summaryDialog = false" color="primary" dark
                        >Close</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-dialog>

              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-data-table
                      :headers="headers"
                      :items="bookings"
                      :items-per-page="5"
                      class="elevation-1"
                      dense
                    >
                      <!-- <template v-slot:[`item.status`]="props">
                        <v-chip
                          :color="getStatusColor(props.item.status)"
                          small
                        >
                          {{ props.item.status }}
                        </v-chip>
                      </template> -->
                      <template v-slot:[`item.status`]="{ item }">
                        <v-chip :color="getStatusColor(item.status)" small>
                          {{ item.status }}
                        </v-chip>
                      </template>

                      <!-- <template v-slot:[`item.actions`]="props">
                        <v-icon
                          small
                          class="mr-2"
                          @click="editBooking(props.item)"
                        >
                          mdi-pencil
                        </v-icon>
                        <v-icon small @click="deleteBooking(props.item)">
                          mdi-delete
                        </v-icon>
                      </template> -->
                      <template v-slot:[`item.actions`]="{ item }">
                        <v-icon small class="mr-2" @click="editBooking(item)">
                          mdi-pencil
                        </v-icon>
                        <v-icon small @click="deleteBooking(item)">
                          mdi-delete
                        </v-icon>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-card>
              <v-card-title class="headline font-weight-bold"
                >Settings</v-card-title
              >
              <v-card-text>
                <v-row align="center">
                  <v-col cols="8">
                    <!-- Detail about service charge. -->
                    <p class="mb-0">Manage detail about service charge.</p>
                  </v-col>
                  <!-- <v-col cols="5" class="d-flex justify-center">
                    <img
                      src="@/assets/maid.png"
                      alt="Setting Image"
                      style="
                        width: 50px;
                        height: 50px;
                        margin-left: auto;
                        margin-right: 10px;
                        display: block;
                      "
                    />
                  </v-col> -->
                  <v-col cols="4" class="d-flex justify-end">
                    <v-avatar size="50" color="primary" class="white--text">
                      <v-icon>mdi-broom</v-icon>
                    </v-avatar>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-text>
                <!-- <v-btn
                  color="primary"
                  @click="dialogManageHousekeeping = true"
                  class="ma-2"
                  style="width: 95%"
                >
                  <v-icon large>mdi-settings</v-icon>
                  Settings
                </v-btn> -->
                <v-btn
                  color="primary"
                  @click="dialogManageHousekeeping = true"
                  dark
                >
                  Manage
                </v-btn>
                <v-dialog v-model="dialogManageHousekeeping" max-width="500px">
                  <v-card>
                    <v-card-title>
                      <span class="headline">Manage Service</span>
                    </v-card-title>
                    <v-card-text>
                      <v-data-table
                        :headers="housekeepingHeaders"
                        :items="housekeepingData"
                        hide-default-footer
                        class="elevation-1"
                      >
                        <template v-slot:[`item.housekeepingActions`]="props">
                          <v-icon small @click="editHousekeeping(props.item)"
                            >mdi-pencil</v-icon
                          >
                          <v-icon small @click="deleteHousekeeping(props.item)"
                            >mdi-delete</v-icon
                          >
                        </template>
                      </v-data-table>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        @click="dialogManageHousekeeping = false"
                        style="width: 100%"
                        >Close</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="3">
            <v-card>
              <v-card-title class="headline font-weight-bold">Promotion</v-card-title>
              <v-card-text>
                <v-row align="center">
                  <v-col cols="8">
                    <p class="mb-0">Manage detail about Promotion.</p>
                  </v-col>
                  <v-col cols="4" class="d-flex justify-end">
                    <v-avatar size="50" color="primary" class="white--text">
                      <v-icon>mdi-sale-outline</v-icon>
                    </v-avatar>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-text>
                <v-btn
                  color="primary"
                  @click="dialogManagePromotion = true"
                  dark
                >
                  Manage
                </v-btn>
                <v-dialog v-model="dialogManagePromotion" max-width="500px">
                  <v-card>
                    <v-card-title>
                      <span class="headline">Manage Promotion</span>
                    </v-card-title>
                    <v-card-text>
                      <v-data-table
                        :headers="promotionHeaders"
                        :items="promotionData"
                        hide-default-footer
                        class="elevation-1"
                      >
                        <template v-slot:[`item.promotionActions`]="props">
                          <v-icon small @click="editPromotion(props.item)"
                            >mdi-pencil</v-icon
                          >
                          <v-icon small @click="deletePromotion(props.item)"
                            >mdi-delete</v-icon
                          >
                        </template>
                      </v-data-table>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        @click="dialogManagePromotion = false"
                        style="width: 100%"
                        >Close</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="6">
            <v-card>
              <v-card-title class="headline"> Total Income</v-card-title>
              <v-card-text>Overview</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import enurl from "@/api/environment";
import axios from "axios";

export default {
  name: "HotelUI",
  data: () => ({
    url: enurl.apiUrl,
    StartDate: "",
    EndDate: "",
    menuStartDate: false,
    menuEndDate: false,
    dialog: false,
    dialogManage: false,
    dialogManagePromotion: false,
    dialogManageHousekeeping: false,
    roomType: null,
    roomTypes: [],
    roomdisplay: "",
    prices: [],
    headers: [
      {
        text: "No.Booking",
        align: "start",
        value: "id",
        sortable: false,
      },
      { text: "Check-in Date", value: "checkin", sortable: false },
      { text: "Check-out Date", value: "checkout", sortable: false },
      { text: "Room type", value: "roomtype", sortable: false },
      { text: "Amount", value: "amount", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    bookings: [],
    summaryDialog: false,
    housekeepingHeaders: [
      { text: "Title", value: "title", sortable: false },
      { text: "Price", value: "Price", sortable: false },
      { text: "Actions", value: "housekeepingActions", sortable: false },
    ],
    housekeepingData: [],
    promotionHeaders: [
      {
        text: "No.",
        align: "start",
        value: "id",
        sortable: false,
      },
      { text: "Title", value: "title", sortable: false },
      { text: "Start Date", value: "startdate", sortable: false },
      { text: "End Date", value: "startdate", sortable: false },
      { text: "Discount", value: "Price", sortable: false },
      { text: "Actions", value: "promotionActions", sortable: false },
    ],
    promotionData: [],
  }),
  async mounted() {
    await this.GetDataRoomtype();
  },
  methods: {
    getStatusColor(status) {
      switch (status) {
        case "reserved":
          return "blue";
        case "checked-in":
          return "green";
        case "wait check-in":
          return "orange";
        default:
          return "grey";
      }
    },

    editBooking(item) {
      console.log("Edit booking:", item);
    },

    deleteBooking(item) {
      console.log("Delete bookingง:", item);
    },
    saveBooking(item) {
      console.log("Save booking:", item);
    },
    submitBooking() {
      this.saveBooking();
      this.summaryDialog = true;
    },
    editHousekeeping(item) {
      console.log("Edit data:", item);
    },
    deleteHousekeeping(item) {
      console.log("Delete data:", item);
    },
    editPromotion(item) {
      console.log("Edit promotion:", item);
    },
    deletePromotion(item) {
      console.log("Delete promotion:", item);
    },
    openbookingsummary() {
      this.roomdisplay = this.roomTypes.find(
        (x) => x.id == this.roomType
      ).room_type;
      console.log(this.roomTypes.filter((x) => x.id == this.roomType));
      this.summaryDialog = true;
    },
    async GetDataRoomtype() {
      let self = this;
      await axios
        .get(`${self.url}Booking/GetDataRoomtype`)
        .then(function (response) {
          console.log(response.data.data)
          if (response.data.status == 0) {
            self.roomTypes = response.data.data;
          }
        });
    },
  },
};
</script>

<style>
.v-application {
  font-family: "Roboto", sans-serif;
}

.v-card {
  transition: box-shadow 0.3s ease-in-out;
}

.v-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
}

.v-btn {
  text-transform: none;
  font-weight: 500;
}

.v-chip {
  font-weight: 500;
}

.v-data-table {
  border-radius: 4px;
}
</style>
