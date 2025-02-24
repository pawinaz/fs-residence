<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-icon>mdi-sleep</v-icon>
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
                <v-btn rounded color="primary" @click="dialog = true" dark>
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
                            <v-text-field
                              v-model="name"
                              label="Name"
                              outlined
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="4" md="6">
                            <v-select
                              v-model="roomType"
                              :items="roomTypes"
                              item-text="room_type"
                              item-value="id"
                              label="Room Type"
                              outlined
                              dense
                              :rules="[(v) => !!v || 'Room type is required']"
                            ></v-select>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" sm="4" md="6">
                            <v-menu
                              v-model="menuStartDate"
                              :close-on-content-click="false"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="StartDate"
                                  label="Check-in Date"
                                  append-icon="mdi-calendar-heart"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                  outlined
                                  dense
                                  :rules="[(v) => !!v || 'Required']"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="StartDate"
                                no-title
                                :min="new Date().toISOString().substr(0, 10)"
                                @change="menuStartDate = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" sm="4" md="6">
                            <v-menu
                              v-model="menuEndDate"
                              :close-on-content-click="false"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="EndDate"
                                  label="Check-out Date"
                                  append-icon="mdi-calendar-heart"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                  outlined
                                  dense
                                  :rules="[(v) => !!v || 'Required']"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="EndDate"
                                no-title
                                :min="new Date().toISOString().substr(0, 10)"
                                @input="menuEndDate = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="dialog = false">Cancel</v-btn>
                    <v-btn color="primary" @click="openbookingsummary()"
                      >Submit</v-btn
                    >
                  </v-card-actions>
                </v-card>

                <v-dialog v-model="summaryDialog" max-width="700px">
                  <v-card>
                    <v-card-title class="primary white--text">
                      Booking Summary
                    </v-card-title>
                    <v-card-text class="pt-4">
                      <v-simple-table>
                        <template v-slot:default>
                          <tbody>
                            <tr>
                              <td class="font-weight-medium">Name:</td>
                              <td>{{ namedisplay }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-medium">Check-in Date:</td>
                              <td>{{ startdatedisplay }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-medium">
                                Check-out Date:
                              </td>
                              <td>{{ enddatedisplay }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-medium">Room Type:</td>
                              <td>{{ roomTypedisplay }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-medium">Duration:</td>
                              <td>{{ diffdatedisplay }} nights</td>
                            </tr>
                            <tr>
                              <td class="font-weight-medium">
                                Room Price per night:
                              </td>
                              <td>{{ roompricedisplay }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-medium">Service:</td>
                              <td>{{ servicedisplay }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-medium">TAX:</td>
                              <td>{{ vatdisplay }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-medium">Discount:</td>
                              <td>{{ discountdisplay }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-medium">
                                Subtotal(inc. VAT):
                              </td>
                              <td class="font-weight-medium">
                                {{ totalpricevatdisplay }}
                              </td>
                            </tr>
                            <tr>
                              <td class="font-weight-medium">Total Price:</td>
                              <td class="font-weight-medium">
                                {{ totalpricedisplay }}
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-card-text>
                    <v-divider></v-divider>

                    <v-card-actions class="pa-4">
                      <v-spacer></v-spacer>
                      <v-btn text @click="summaryDialog = false">Back</v-btn>
                      <v-btn color="primary" @click="SaveTransection">
                        Confirm Booking
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
                      :items="bookingData"
                      :items-per-page="15"
                      class="elevation-2 rounded-lg"
                      dense
                    >
                      <template v-slot:body="{ items }">
                        <tr v-for="item in items" :key="item.id">
                          <td class="text-center">{{ item.id }}</td>
                          <td class="text-center">{{ item.name }}</td>
                          <td class="text-center">
                            {{ ChangeFormatDate(item.start_date) }}
                          </td>
                          <td class="text-center">
                            {{ ChangeFormatDate(item.end_date) }}
                          </td>
                          <td class="text-center">{{ item.room_type }}</td>
                          <td class="text-center">
                            {{ parseFloat(item.price).toFixed(0) }}
                          </td>
                          <td class="text-center"> 
                            <v-icon v-if="item.status" color="green">
                                mdi-check-circle
                           </v-icon>
                             <v-icon v-else color="red">
                                mdi-close-circle
                            </v-icon>
                          </td>
                          <td class="text-center"> 
                            <v-icon v-if="item.cancel_status" color="green">
                                mdi-check-circle
                           </v-icon>
                             <v-icon v-else color="red">
                                mdi-close-circle
                            </v-icon>
                          </td>

                          <td class="text-center">
                            <v-btn
                              :disabled="item.status || item.cancel_status"
                              class="ma-1"
                              small
                              icon
                              color="orange"
                              @click="checkoutBooking(item)"
                            >
                              <v-icon>mdi-book-check</v-icon>
                            </v-btn>
                            <v-btn
                              :disabled="item.status || item.cancel_status"
                              class="mx-1"
                              small
                              icon
                              color="red"
                              @click="deleteBooking(item)"
                            >
                              <v-icon dark>mdi-delete</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3" sm="3" md="3">
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
                    <v-card-text class="pa-4">
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

          <v-col cols="3" sm="3" md="3">
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
                              {{ ChangeFormatDate(item.start_date) }}
                            </td>
                            <td class="text-center">
                              {{ ChangeFormatDate(item.end_date) }}
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

          <v-dialog v-model="showeditPromotion" persistent max-width="500">
            <v-card>
              <v-card-title class="text-h6 font-weight-bold"
                >Edit Promotion</v-card-title
              >
              <v-divider></v-divider>
              <v-card-text class="pa-4">
                <v-text-field
                  v-show="false"
                  v-model="editedPromotion.id"
                  label="ID"
                  outlined
                  dense
                ></v-text-field>
                <v-text-field
                  v-model="editedPromotion.promotion"
                  label="Title"
                  outlined
                  dense
                ></v-text-field>
                <v-menu
                  v-model="menuStart"
                  :close-on-content-click="false"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :value="ChangeFormatDate(editedPromotion.start_date)"
                      @input="updateStartDate($event)"
                      label="Start Date"
                      append-icon="mdi-calendar-heart"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      outlined
                      dense
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="editedPromotion.start_date"
                    no-title
                    @change="menuStart = false"
                  ></v-date-picker>
                </v-menu>

                <v-menu
                  v-model="menuEnd"
                  :close-on-content-click="false"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :value="ChangeFormatDate(editedPromotion.end_date)"
                      @input="updateEndDate($event)"
                      label="Start Date"
                      append-icon="mdi-calendar-heart"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      outlined
                      dense
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="editedPromotion.end_date"
                    no-title
                    @change="menuEnd = false"
                  ></v-date-picker>
                </v-menu>
                <v-text-field
                  v-model="editedPromotion.discount"
                  label="Discount"
                  outlined
                  dense
                ></v-text-field>
                <v-switch
                  v-model="editedPromotion.status"
                  inset
                  label="Active Status"
                  dense
                ></v-switch>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="pa-3 justify-end">
                <v-btn text color="grey" @click="showeditPromotion = false"
                  >Cancel</v-btn
                >
                <v-btn text color="primary" @click="savePromotion()"
                  >Save</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- <v-col cols="6">
            <v-card>
              <v-card-title class="headline"> Total Income</v-card-title>
              <v-card-text>Overview</v-card-text>
            </v-card>
          </v-col> -->

          <v-col cols="3" sm="3" md="3">
            <v-card>
              <v-card-title class="headline font-weight-bold"
                >Manage Room</v-card-title
              >
              <v-card-text>
                <v-row align="center">
                  <v-col cols="8">
                    <p class="mb-0">Manage detail about Room .</p>
                  </v-col>
                  <v-col cols="4" class="d-flex justify-end">
                    <v-avatar size="50" color="primary" class="white--text">
                      <v-icon>mdi-bed-outline</v-icon>
                    </v-avatar>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-text>
                <v-btn color="primary" @click="GetDataRoom()" dark>
                  Manage
                </v-btn>
                <v-dialog v-model="dialogManageRoom" max-width="800px">
                  <v-card>
                    <v-card-title>
                      <span class="headline">Manage Room</span>
                    </v-card-title>
                    <v-card-text>
                      <v-data-table
                        :headers="roomHeaders"
                        :items="roomData"
                        hide-default-footer
                        class="elevation-1"
                      >
                        <template v-slot:body="{ items }">
                          <tr v-for="item in items" :key="item.id">
                            <td class="text-center">{{ item.id }}</td>
                            <td class="text-center">{{ item.room_type }}</td>
                            <td class="text-center">{{ item.room_price }}</td>
                            <td class="text-center">{{ item.status }}</td>
                            <td class="text-center">
                              <v-btn
                                icon
                                color="primary"
                                @click="editRoom(item)"
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
                      <v-btn @click="dialogManageRoom = false">Close</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-card-text>
            </v-card>
          </v-col>
          <v-dialog v-model="showeditRoom" persistent max-width="500">
            <v-card>
              <v-card-title class="text-h6 font-weight-bold"
                >Edit Room</v-card-title
              >
              <v-divider></v-divider>
              <v-card-text class="pa-4">
                <v-text-field
                  v-show="false"
                  v-model="editedRoom.id"
                  label="ID"
                  outlined
                  dense
                ></v-text-field>
                <v-text-field
                  v-model="editedRoom.room_type"
                  label="Title"
                  outlined
                  dense
                ></v-text-field>
                <v-text-field
                  v-model="editedRoom.room_price"
                  label="Title"
                  outlined
                  dense
                ></v-text-field>
                <v-switch
                  v-model="editedRoom.status"
                  label="Active Status"
                  inset
                  dense
                ></v-switch>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="pa-3 justify-end">
                <v-btn text color="grey" @click="showeditRoom = false"
                  >Cancel</v-btn
                >
                <v-btn text color="primary" @click="saveRoomData()">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
    menuStart: false,
    menuEnd: false,
    dialog: false,
    dialogManage: false,
    dialogManagePromotion: false,
    dialogManageHousekeeping: false,
    dialogManageRoom: false,
    roomType: null,
    roomTypes: [],
    roomdisplay: "",
    prices: [],
    search: "",
    headers: [
      {
        text: "No.Booking",
        align: "center",
        value: "id",
        sortable: false,
      },
      {
        text: "Name",
        align: "center",
        value: "name",
        sortable: false,
      },
      {
        text: "Check-in Date",
        align: "center",
        value: "checkin",
        sortable: false,
      },
      {
        text: "Check-out Date",
        align: "center",
        value: "checkout",
        sortable: false,
      },
      {
        text: "Room type",
        align: "center",
        value: "roomtype",
        sortable: false,
      },
      { text: "Amount", align: "center", value: "amount", sortable: false },
      {
        text: "Check-out Status",
        align: "center",
        value: "status",
        sortable: false,
      },
      {
        text: "Cancel Status",
        align: "center",
        value: "status",
        sortable: false,
      },
      { text: "Actions", align: "center", value: "actions", sortable: false },
    ],
    bookings: [],
    summaryDialog: false,
    housekeepingHeaders: [
      { text: "No.", align: "center", value: "id", sortable: false },
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
    roomData: [],
    roomHeaders: [
      {
        text: "No.",
        align: "center",
        value: "id",
        sortable: false,
      },
      {
        text: "Room Type",
        align: "center",
        value: "Roomtype",
        sortable: false,
      },
      {
        text: "Room Price",
        align: "center",
        value: "roomprice",
        sortable: false,
      },
      {
        text: "Status",
        align: "center",
        value: "status",
        sortable: false,
      },
      {
        text: "Actions",
        align: "center",
        value: "roomActions",
        sortable: false,
      },
    ],
    bookingData: [],
    editedRoom: [],
    showeditRoom: false,
    promotionData: [],
    editedPromotion: [],
    showeditPromotion: false,
    name: "",
    namedisplay: "",
    startdatedisplay: "",
    enddatedisplay: "",
    roomTypedisplay: "",
    roompricedisplay: "",
    servicedisplay: "",
    diffdatedisplay: "",
    totalpricevatdisplay: "",
    vatdisplay: "",
    discountdisplay: "",
    totalpricedisplay: "",
  }),
  async mounted() {
    await this.GetDataRoomtype();
    await this.GetDataBooking();
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
    ReloadPage() {
      window.location.reload();
    },
    // editBooking(item) {
    //   axios
    //     .post(`${this.url}Settings/BookingStatus`, {
    //       room_type: item.room_type,
    //       status: item.status,
    //     })
    //     .then((response) => {
    //       console.log("New status:", item.status);
    //       if (response.data.status === 0) {
    //         // console.log("After API call:", item.status);
    //         Swal.fire("สำเร็จ!", "สถานะถูกอัปเดตแล้ว.", "success");
    //         this.GetDataBooking();
    //       }
    //     })
    //     .catch((error) => {
    //       Swal.fire("เกิดข้อผิดพลาด!", error.response.data.message, "error");
    //     });
    // },
    deleteBooking(item) {
      let self = this;
      let temp = {
        id:item.id,
      };
      Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณต้องการยกเลิกการจองนี้!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ใช่, ยกเลิก!",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .post(`${self.url}Booking/CancelBooking`,temp)
            .then(function (response) {
              if (response.data.status === 0) {
                Swal.fire(
                  "ยกเลิกสำเร็จ!",
                  "การจองของคุณถูกยกเลิกแล้ว.",
                  "success"
                );
                self.GetDataBooking();
              }
            })
            .catch(function (error) {
              Swal.fire(
                "เกิดข้อผิดพลาด!",
                error.response.data.message,
                "error"
              );
            });
        }
      });
    },
    submitBooking() {
      let self = this;
      self.saveBooking();
      // self.summaryDialog = true;
      self.GetDataBooking();
    },
    savebooking() {
      let self = this;
      if (!self.StartDate || !self.EndDate || !self.roomType) {
        Swal.fire({
          icon: "warning",
          title: "กรุณากรอกข้อมูลให้ครบถ้วน",
          text: "กรุณากรอกวันที่เช็คอิน, วันที่เช็คเอาท์ และประเภทห้อง",
        });
        return;
      }
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
            self.vatdisplay = response.data.data.tax;
            self.totalpricedisplay = response.data.data.totalprice;
            self.diffdatedisplay = response.data.data.diffDates;
            self.totalpricevatdisplay = response.data.data.totalprice_vat;
            self.discountdisplay = response.data.data.discount;
            self.namedisplay = self.name;

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
    resetForm() {
      let self = this;
      self.StartDate = "";
      self.EndDate = "";
      self.roomType = "";
    },
    SaveTransection() {
      let self = this;
      let temp = {
        id: self.id,
        name: self.name,
        start_date: self.StartDate,
        end_date: self.EndDate,
        room_type: self.roomType,
        price: self.totalpricedisplay,
        status: self.status,
        roomID: self.roomID,
      };
      console.log("Data to be sent to API:", temp);

      axios
        .post(`${self.url}Booking/SaveBooking`, temp)
        .then(function (response) {
          if (response.data.status === 0) {
            Swal.fire({
              icon: "success",
              title: "บันทึกการจองสำเร็จ",
            });
            self.summaryDialog = false;
            // self.resetForm();
            self.ReloadPage();
          }
        })
        .catch(async function (error) {
          Swal.fire({
            icon: "error",
            title: "ไม่สามารถบันทึกการจองได้",
            text: error.response?.data?.message || "กรุณาลองใหม่อีกครั้ง",
          });
        });
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
      let self = this;
      console.log(item);
      self.editedPromotion.id = item.id;
      self.editedPromotion.promotion = item.promotion;
      self.editedPromotion.start_date = self.ChangeFormatDateForPicker(
        item.start_date
      );
      self.editedPromotion.end_date = self.ChangeFormatDateForPicker(
        item.end_date
      );
      self.editedPromotion.discount = item.discount;
      self.editedPromotion.status = item.status;

      self.showeditPromotion = true;
    },
    ChangeFormatDate(date) {
      if (!date) return null;
      var DateData = new Date(date);

      return (
        DateData.getDate() +
        "/" +
        (DateData.getMonth() + 1) +
        "/" +
        DateData.getFullYear()
      );
    },
    ChangeFormatDateForPicker(date) {
      if (!date) return null;
      var DateData = new Date(date);

      return (
        DateData.getFullYear() +
        "-" +
        (DateData.getMonth() + 1) +
        "-" +
        DateData.getDate()
      );
    },
    updateStartDate(value) {
      const [day, month, year] = value.split("/");
      this.editedPromotion.start_date = `${year}-${month}-${day}`;
    },
    updateEndDate(value) {
      const [day, month, year] = value.split("/");
      this.editedPromotion.end_date_date = `${year}-${month}-${day}`;
    },
    editRoom(item) {
      this.editedRoom = item;
      this.showeditRoom = true;
    },
    openbookingsummary() {
      let self = this;
      self.savebooking();
      if (self.StartDate && self.EndDate && self.roomType) {
        self.summaryDialog = true;
      }
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
    async GetDataBooking() {
      let self = this;
      await axios
        .get(`${self.url}Booking/GetDataBooking`)
        .then(function (response) {
          if (response.data.status == 0) {
            self.bookingData = response.data.data;
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
    savePromotion() {
      let self = this;
      let temp = {
        id: self.editedPromotion.id,
        promotion: self.editedPromotion.promotion,
        start_date: self.editedPromotion.start_date,
        end_date: self.editedPromotion.end_date,
        discount: self.editedPromotion.discount,
        status: self.editedPromotion.status,
      };
      axios
        .post(`${self.url}Settings/SavePromotion`, temp)
        .then((response) => {
          if (response.status === 200) {
            this.GetPromotion();
            this.showeditPromotion = false;
          } else {
            throw new Error("บันทึกข้อมูลไม่สำเร็จ");
          }
        })
        .catch((error) => {
          console.error("Error details:", error);
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
    saveRoomData() {
      let self = this;
      let temp = {
        id: self.editedRoom.id,
        room_type: self.editedRoom.room_type,
        room_price: self.editedRoom.room_price,
        status: self.editedRoom.status,
      };
      axios
        .post(`${self.url}Settings/SaveRoomData`, temp)
        .then((response) => {
          if (response.status === 200) {
            this.GetDataRoom();
            this.showeditRoom = false;
          } else {
            throw new Error("บันทึกข้อมูลไม่สำเร็จ");
          }
        })
        .catch((error) => {
          console.error("Error details:", error);
        });
    },
    async GetDataRoom() {
      let self = this;
      await axios
        .get(`${self.url}Settings/GetRoom`)
        .then(function (response) {
          console.log(response.data.data);
          if (response.data.status == 0) {
            self.roomData = response.data.data;
            self.dialogManageRoom = true;
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
    checkoutBooking(item) {
      let self = this;
      let temp = {
        id: item.id,
      };
      console.log("Data to API:", temp);
      axios
        .post(`${self.url}Booking/Checkout`, temp)
        .then((response) => {
          if (response.status === 200 && response.data.status === 0) {
            this.GetDataBooking();
            Swal.fire({
              icon: "success",
              title: "บันทึกข้อมูลสำเร็จ",
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "บันทึกข้อมูลไม่สำเร็จ",
              width: 500,
              text: response.data.message,
            });
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
  font-family: "Kanit", "Roboto", sans-serif !important;
  background-color: whitesmoke;
}

.v-card {
  transition: all 0.3s ease;
  border-radius: 12px !important;
}

.v-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
}

.v-card__title {
  font-size: 1.25rem !important;
  padding: 20px 24px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.v-btn {
  text-transform: none !important;
  letter-spacing: 0.5px;
  font-weight: 500;
  border-radius: 8px !important;
}

.v-btn.primary {
  background: linear-gradient(45deg, #1976d2, #2196f3) !important;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3) !important;
}

.v-data-table {
  border-radius: 12px !important;
  overflow: hidden;
}
.v-data-table th {
  font-weight: 600 !important;
  text-transform: uppercase;
  font-size: 0.8rem !important;
  background-color: white !important;
}

.v-dialog .v-card {
  border-radius: 16px !important;
  overflow: hidden;
}

.v-text-field.v-text-field--outlined .v-input__control {
  min-height: 44px !important;
}

.v-text-field--outlined fieldset {
  border-radius: 8px !important;
}

.v-app-bar {
  backdrop-filter: blur(10px);
  background: linear-gradient(45deg, #1976d2, #2196f3) !important;
}

.v-toolbar-title {
  font-size: 1.4rem !important;
  font-weight: 700 !important;
}
</style>
