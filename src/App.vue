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
              <v-dialog v-model="dialog" max-width="500px">
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
                  <v-card class="mx-auto" max-width="800">
                    <v-card-title
                      class="headline font-weight-bold text-center primary white--text"
                    >
                      Booking Summary
                    </v-card-title>

                    <v-card-text class="mt-4">
                      <v-simple-table>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-center">Check-in Date</th>
                              <th class="text-center">Check-out Date</th>
                              <th class="text-center">Room Price</th>
                              <th class="text-center">Duration</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td class="text-center subtitle-1">
                                {{ startdatedisplay }}
                              </td>
                              <td class="text-center subtitle-1">
                                {{ enddatedisplay }}
                              </td>
                              <td class="text-center subtitle-1">
                                {{ roompricedisplay }}
                              </td>
                              <td class="text-center subtitle-1">
                                {{ diffdatedisplay }}
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="pa-4">
                      <v-spacer></v-spacer>
                      <v-btn
                        @click="submitBooking"
                        color="primary"
                        class="px-6"
                        elevation="2"
                      >
                        Save
                      </v-btn>
                      <v-btn
                        @click="summaryDialog = false"
                        class="ml-2"
                        outlined
                      >
                        Close
                      </v-btn>
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
                      <template v-slot:[`item.status`]="{ item }">
                        <v-chip :color="getStatusColor(item.status)" small>
                          {{ item.status }}
                        </v-chip>
                      </template>

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
                    <p class="mb-0">Manage detail about service charge.</p>
                  </v-col>

                  <v-col cols="4" class="d-flex justify-end">
                    <v-avatar size="50" color="primary" class="white--text">
                      <v-icon>mdi-broom</v-icon>
                    </v-avatar>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-text>
                <v-btn color="primary" @click="GetServiceCharges()" dark>
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
                        <template v-slot:body="{ items }">
                          <tr v-for="item in items" :key="item.id">
                            <td class="text-center">{{ item.id }}</td>
                            <td class="text-center">{{ item.list_service }}</td>
                            <td class="text-center">{{ item.price }}</td>
                            <td class="text-center">
                              <v-btn
                                icon
                                color="primary"
                                @click="editHousekeeping(item)"
                              >
                                <v-icon>mdi-pencil</v-icon>
                              </v-btn>
                            </td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn @click="dialogManageHousekeeping = false"
                        >Close</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-card-text>
            </v-card>
          </v-col>
          <v-dialog v-model="showeditHousekeeping" persistent max-width="500">
            <v-card>
              <v-card-title class="text-h6 font-weight-bold"
                >Edit Settings</v-card-title
              >
              <v-divider></v-divider>
              <v-card-text class="pa-4">
                <v-text-field
                  v-show="false"
                  v-model="editedHousekeeping.id"
                  label="ID"
                  outlined
                  dense
                ></v-text-field>
                <v-text-field
                  v-model="editedHousekeeping.list_service"
                  label="Title"
                  outlined
                  dense
                ></v-text-field>
                <v-text-field
                  v-model="editedHousekeeping.price"
                  label="Price"
                  outlined
                  dense
                ></v-text-field>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="pa-3 justify-end">
                <v-btn text color="grey" @click="showeditHousekeeping = false"
                  >Cancel</v-btn
                >
                <v-btn text color="primary" @click="saveItem()">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-col cols="3">
            <v-card>
              <v-card-title class="headline font-weight-bold"
                >Promotion</v-card-title
              >
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
                <v-btn color="primary" @click="GetPromotion()" dark>
                  Manage
                </v-btn>
                <v-dialog v-model="dialogManagePromotion" max-width="800px">
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
                        <template v-slot:body="{ items }">
                          <tr v-for="item in items" :key="item.id">
                            <td class="text-center">{{ item.id }}</td>
                            <td class="text-center">{{ item.promotion }}</td>
                            <td class="text-center">
                              {{
                                new Date(item.start_date).toLocaleDateString()
                              }}
                            </td>
                            <td class="text-center">
                              {{ new Date(item.end_date).toLocaleDateString() }}
                            </td>
                            <td class="text-center">{{ item.discount }}</td>
                            <td class="text-center">
                              <v-btn
                                icon
                                color="primary"
                                @click="editPromotion(item)"
                              >
                                <v-icon>mdi-pencil</v-icon>
                              </v-btn>
                            </td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn @click="dialogManagePromotion = false"
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
import Swal from "sweetalert2/dist/sweetalert2.js";

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
      { text: "Title", align: "center", value: "title", sortable: false },
      { text: "Price", align: "center", value: "price", sortable: false },
      {
        text: "Actions",
        align: "center",
        value: "housekeepingActions",
        sortable: false,
      },
    ],
    housekeepingData: [],
    editedHousekeeping: [],
    showeditHousekeeping: false,
    promotionHeaders: [
      {
        text: "No.",
        align: "center",
        value: "id",
        sortable: false,
      },
      { text: "Title", align: "center", value: "title", sortable: false },
      {
        text: "Start Date",
        align: "center",
        value: "startdate",
        sortable: false,
      },
      {
        text: "End Date",
        align: "center",
        value: "startdate",
        sortable: false,
      },
      { text: "Discount", align: "center", value: "Price", sortable: false },
      {
        text: "Actions",
        align: "center",
        value: "promotionActions",
        sortable: false,
      },
    ],
    promotionData: [],
    startdatedisplay: "",
    enddatedisplay: "",
    roomTypedisplay: "",
    roompricedisplay: "",
    servicedisplay: "",
    diffdatedisplay: "",
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
    submitBooking() {
      let self = this;
      self.saveBooking();
      self.summaryDialog = true;
    },
    savebooking() {
      let self = this;
      let temp = {
        start_date: self.StartDate,
        end_date: self.EndDate,
        room_type: self.roomType,
      };
      axios
        .post(`${self.url}Booking/CalculateRoomPrice`, temp)
        .then(function (response) {
          if (response.data.status == 0) {
            self.roomTypedisplay = response.data.data.room_type;
            self.startdatedisplay = response.data.data.start_date;
            self.enddatedisplay = response.data.data.end_date;
            self.roompricedisplay = response.data.data.roomprice;
            self.servicedisplay = response.data.data.service;
            self.diffdatedisplay = response.data.data.diffDates;
            self.GetDataRoomtype();
            self.summaryDialog = true;
          }
        })
        .catch(function (error) {
          Swal.fire({
            icon: "error",
            title: "Error...",
            width: 900,
            text: error.response.data.message,
          });
        });
    },
    ReloadPage() {
      window.location.reload();
    },
    editHousekeeping(item) {
      this.editedHousekeeping = item;
      this.showeditHousekeeping = true;
    },
    saveItem() {
      let self = this;
      let temp = {
        id: self.editedHousekeeping.id,
        list_service: self.editedHousekeeping.list_service,
        price: self.editedHousekeeping.price,
      };

      axios
        .post(`${self.url}Settings/SaveServiceCharge`, temp)
        .then((response) => {
          if (response.status === 200) {
            this.GetServiceCharges();
            this.showeditHousekeeping = false;
          } else {
            throw new Error("บันทึกข้อมูลไม่สำเร็จ");
          }
        })
        .catch((error) => {
          console.error("Error details:", error);
        });
    },
    editPromotion(item) {
      console.log("Edit promotion:", item);
    },
    deletePromotion(item) {
      console.log("Delete promotion:", item);
    },
    openbookingsummary() {
      let self = this;
      self.savebooking();
      self.summaryDialog = true;
    },
    async GetDataRoomtype() {
      let self = this;
      await axios
        .get(`${self.url}Booking/GetDataRoomtype`)
        .then(function (response) {
          if (response.data.status == 0) {
            self.roomTypes = response.data.data;
          }
        })
        .catch(function (error) {
          Swal.fire({
            icon: "error",
            title: "Error...",
            width: 900,
            text: error.response.data.message,
          });
        });
    },
    async GetServiceCharges() {
      let self = this;
      await axios
        .get(`${self.url}Settings/GetServiceCharges`)
        .then(function (response) {
          console.log(response.data.data);
          if (response.data.status == 0) {
            self.housekeepingData = response.data.data;
            self.dialogManageHousekeeping = true;
          }
        })
        .catch(function (error) {
          Swal.fire({
            icon: "error",
            title: "Error...",
            width: 900,
            text: error.response.data.message,
          });
        });
    },
    async GetPromotion() {
      let self = this;
      await axios
        .get(`${self.url}Settings/GetPromotion`)
        .then(function (response) {
          console.log(response.data.data);
          if (response.data.status == 0) {
            self.promotionData = response.data.data;
            self.dialogManagePromotion = true;
          }
        })
        .catch(function (error) {
          Swal.fire({
            icon: "error",
            title: "Error...",
            width: 900,
            text: error.response.data.message,
          });
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
