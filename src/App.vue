<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-icon>mdi-sleep</v-icon>
      <v-toolbar-title style="margin-left: 10px; font-weight: 600"
        >FS Residence</v-toolbar-title
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
                              :rules="[(v) => !!v || 'Name is required']"
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
                                  :rules="[
                                    (v) => !!v || 'Check-in date is Required',
                                  ]"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="StartDate"
                                no-title
                                
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
                                  :rules="[
                                    (v) => !!v || 'Check-out is Required',
                                  ]"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="EndDate"
                                no-title
                               
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
              </v-dialog>

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
                            <td class="font-weight-medium">Customer Name:</td>
                            <td>{{ namedisplay }}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-medium">Check-in Date:</td>
                            <td>{{ startdatedisplay }}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-medium">Check-out Date:</td>
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
                              Room Charges:
                            </td>
                            <td>{{ numberWithCommas(totalroompricedis) }}</td>
                          </tr>
                          <!-- <tr>
                            <td class="font-weight-medium">
                              Room Price per night:
                            </td>
                            <td>{{ numberWithCommas(roompricedisplay) }}</td>
                          </tr> -->
                          <tr>
                            <td class="font-weight-medium">Service charge:</td>
                            <td>{{ numberWithCommas(servicedisplay) }}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-medium">Tax:</td>
                            <td>
                              {{
                                numberWithCommas(
                                  parseFloat(vatdisplay).toFixed(2)
                                )
                              }}
                            </td>
                          </tr>
                          <tr>
                            <td class="font-weight-medium">
                              Total Before Discount:
                            </td>
                            <td class="font-weight-medium">
                              {{
                                numberWithCommas(
                                  parseFloat(totalrealprice).toFixed(2)
                                )
                              }}
                            </td>
                          </tr>
                          <tr>
                            <td class="font-weight-medium">Discount Applied :</td>
                            <td>
                              {{
                                discountdisplay
                                  ? numberWithCommas(
                                      parseFloat(discountdisplay).toFixed(2)
                                    )
                                  : "0.00"
                              }}
                            </td>
                          </tr>
                          <tr>
                            <td class="font-weight-medium">Total Payable:</td>
                            <td class="font-weight-medium">
                              {{
                                numberWithCommas(
                                  parseFloat(totalpricedisplay).toFixed(2)
                                )
                              }}
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card-text>
                  <v-divider></v-divider>

                  <v-card-actions class="pa-4" v-if="dialogMode === 'booking'">
                    <v-spacer></v-spacer>
                    <v-btn text @click="summaryDialog = false">Back</v-btn>
                    <v-btn color="primary" @click="SaveTransection"
                      >Confirm Booking</v-btn
                    >
                  </v-card-actions>

                  <v-card-actions
                    class="pa-4"
                    v-else-if="dialogMode === 'view'"
                  >
                    <v-spacer></v-spacer>
                    <v-btn text @click="summaryDialog = false">Close</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-data-table
                      :headers="headers"
                      :items="bookingData"
                      :items-per-page="10"
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
                            {{
                              numberWithCommas(
                                parseFloat(item.price).toFixed(2)
                              )
                            }}
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
                              class="ma-1"
                              small
                              icon
                              color="blue"
                              @click="
                                openviewdatasummary(item);
                                summaryDialog = true;
                              "
                            >
                              <v-icon>mdi-eye-outline</v-icon>
                            </v-btn>
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
          <v-col cols="4">
            <v-card elevation="2" class="income-card">
              <v-card-title class="income-header d-flex align-center pa-4">
                <v-icon left size="30" class="income-icon mr-3" color="primary"
                  >mdi-cash-multiple</v-icon
                >
                Total income
                <v-spacer></v-spacer>
                <v-btn icon class="refresh-btn" @click="GetTotalIncome">
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </v-card-title>

              <v-card-text class="income-content pa-6">
                <v-row justify="center" align="center">
                  <v-col v-if="loading" class="text-center">
                    <v-progress-circular
                      indeterminate
                      color="primary"
                      size="50"
                      width="5"
                    ></v-progress-circular>
                  </v-col>
                  <v-col v-else class="text-center">
                    <div class="income-label text-subtitle-1 grey--text mb-2">
                      Total Income
                    </div>
                    <div class="income-amount font-weight-bold primary--text">
                      ฿{{
                        numberWithCommas(parseFloat(totalIncome).toFixed(2))
                      }}
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="8">
            <v-card class="room-income-card">
              <v-card-title class="room-income-header">
                <v-icon left size="24" class="mr-2" color="primary"
                  >mdi-chart-box</v-icon
                >
                Income by room type
              </v-card-title>
              <v-card-text class="pa-4">
                <v-data-table
                  :headers="incomeheader"
                  :items="incomeByRoomType"
                  item-value="roomType"
                  class="elevation-2 room-income-table"
                  hide-default-footer
                  dense
                >
                  <template v-slot:[`item.totalIncome`]="{ item }">
                    <span class="font-weight-medium">
                      ฿{{
                        numberWithCommas(
                          parseFloat(item.totalIncome).toFixed(2)
                        )
                      }}
                    </span>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4" sm="4" md="4">
            <v-card>
              <v-card-title class="headline font-weight-bold"
                >Service Charge</v-card-title
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
                            <td class="text-center">
                              {{ numberWithCommas(item.price) }}
                            </td>
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

          <v-col cols="4" sm="4" md="4">
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
                            <td class="text-center">
                              {{ numberWithCommas(item.discount) }}
                            </td>
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
                      label="End Date"
                      append-icon="mdi-calendar-heart"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      outlined
                      dense
                      
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
                  type="number"
                  :rules="[
                    (v) => !!v || 'Required',
                    (v) => v > 0 || 'Discount must be greater than 0',
                  ]"
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

          <v-col cols="4" sm="4" md="4">
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
                            <td class="text-center">
                              {{ numberWithCommas(item.room_price) }}
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
                <v-btn text color="primary" @click="SaveRoomDatanew()">Save</v-btn>
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
        value: "checkout_status",
        sortable: false,
      },
      {
        text: "Cancel Status",
        align: "center",
        value: "cancel_status",
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
        value: "enddate",
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
        value: "roomtype",
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
    totalroompricedis:"",
    totalrealprice:"",
    roompricedisplay: "",
    servicedisplay: "",
    diffdatedisplay: "",
    totalpricevatdisplay: "",
    vatdisplay: "",
    discountdisplay: "",
    totalpricedisplay: "",
    dialogMode: "booking" || "view",
    totalIncome: 0,
    loading: true,
    error: null,
    incomeByRoomType: [],
    incomeheader: [
      { text: "Room Type", align: "center", value: "roomType" },
      { text: "Totalincome", align: "center", value: "totalIncome" },
    ],
  }),
  async mounted() {
    await this.GetDataRoomtype();
    await this.GetDataBooking();
    await this.AutoCheckout();
    await this.GetTotalIncome();
  },
  methods: {
    async GetTotalIncome() {
      let self = this;
      self.loading = true;
      try {
        const response = await axios.get(`${self.url}Booking/GetTotalIncome`);
        if (response.data.status === 0) {
          self.totalIncome = response.data.data;
          self.incomeByRoomType = response.data.incomeByRoomType;
        } else {
          self.totalIncome = 0;
        }
      } catch (error) {
        console.error("Error:", error);
        self.totalIncome = 0;
      } finally {
        self.loading = false;
      }
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    ReloadPage() {
      window.location.reload();
    },
    deleteBooking(item) {
      let self = this;
      let temp = {
        id: item.id,
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
            .post(`${self.url}Booking/CancelBooking`, temp)
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
      self.GetDataBooking();
    },
    openviewdatasummary(item) {
      let self = this;
      self.viewDataBooking(item);
      self.dialogMode = "view";
      self.summaryDialog = true;
    },
    viewDataBooking(item) {
      let self = this;
      let temp = {
        start_date: self.ChangeDate(item.start_date),
        end_date: self.ChangeDate(item.end_date),
        room_type: item.roomID,
      };
      axios
        .post(`${self.url}Booking/Viewdatabooking`, temp)
        .then(function (response) {
          if (response.data.status == 0) {
            self.roomTypedisplay = response.data.data.room_type;
            self.startdatedisplay = response.data.data.start_date;
            self.enddatedisplay = response.data.data.end_date;
            self.totalroompricedis = response.data.data.realprice;
            self.totalrealprice = response.data.data.realprice_vat;
            self.roompricedisplay = response.data.data.roomprice;
            self.servicedisplay = response.data.data.service;
            self.vatdisplay = response.data.data.tax;
            self.totalpricedisplay = response.data.data.totalprice;
            self.diffdatedisplay = response.data.data.diffDates;
            self.totalpricevatdisplay = response.data.data.totalprice_vat;
            self.discountdisplay = response.data.data.discount;
            self.namedisplay = item.name;

            self.summaryDialog = true;
            self.GetDataRoomtype();
          } else {
            console.error("Error in response status:", response.data.status);
          }
        })
        .catch(function (error) {
          console.error("Error fetching booking data:", error);
          Swal.fire({
            icon: "error",
            title: "Error...",
            width: 900,
            text: error.response.data.message,
          });
        });
    },
    savebooking() {
      let self = this;
      if (!self.name || !self.StartDate || !self.EndDate || !self.roomType) {
        Swal.fire({
          icon: "warning",
          title: "กรุณากรอกข้อมูลให้ครบถ้วน",
          text: "กรุณากรอกชื่อ, วันที่เช็คอิน, วันที่เช็คเอาท์ และประเภทห้อง",
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
            self.totalroompricedis = response.data.data.realprice;
            self.totalrealprice = response.data.data.realprice_vat;
            self.roompricedisplay = response.data.data.roomprice;
            self.servicedisplay = response.data.data.service;
            self.vatdisplay = response.data.data.tax;
            self.totalpricedisplay = response.data.data.totalprice;
            self.diffdatedisplay = response.data.data.diffDates;
            self.totalpricevatdisplay = response.data.data.totalprice_vat;
            self.discountdisplay = response.data.data.discount;
            self.namedisplay = self.name;

            self.summaryDialog = true;
            self.GetDataRoomtype();
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
      axios
        .post(`${self.url}Booking/SaveBooking`, temp)
        .then(function (response) {
          if (response.data.status === 0) {
            Swal.fire({
              icon: "success",
              title: "บันทึกการจองสำเร็จ",
              timer: 1500,
            });
            self.summaryDialog = false;
            // self.resetForm();
            self.ReloadPage();
            self.GetTotalIncome();
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
      let self = this;
      self.editedHousekeeping = item;
      self.showeditHousekeeping = true;
    },
    saveItem() {
      let self = this;
      //ตรวจสอบการกรองข้อมูล
      if (
        !self.editedHousekeeping.list_service ||
        !self.editedHousekeeping.price
      ) {
        Swal.fire({
          icon: "warning",
          title: "กรุณากรอกข้อมูลให้ครบถ้วน",
          text: "กรุณากรอกชื่อ service และราคา",
        });
        return;
      }

      // ตรวจสอบราคา
      if (
        isNaN(self.editedHousekeeping.price) ||
        self.editedHousekeeping.price <= 0
      ) {
        Swal.fire({
          icon: "warning",
          title: "ราคาไม่ถูกต้อง",
          text: "กรุณากรอกราคาให้ถูกต้อง",
        });
        return;
      }
      let temp = {
        id: self.editedHousekeeping.id,
        list_service: self.editedHousekeeping.list_service,
        price: self.editedHousekeeping.price,
      };

      axios
        .post(`${self.url}Settings/SaveServiceCharge`, temp)
        .then((response) => {
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "บันทึกข้อมูลสำเร็จ",
            });
            self.GetServiceCharges();
            self.showeditHousekeeping = false;
          }
        })
        .catch(async function (error) {
          Swal.fire({
            icon: "error",
            title: "ไม่สามารถบันทึกข้อมูลได้",
            text: error.response?.data?.message || "กรุณาลองใหม่อีกครั้ง",
          });
        });
    },
    editPromotion(item) {
      let self = this;
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
    ChangeDate(date) {
      if (!date) return null;
      var DateData = new Date(date);

      return (
        DateData.getFullYear() +
        "-" +
        ("0" + (DateData.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + DateData.getDate()).slice(-2)
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
      this.editedPromotion.end_date = `${year}-${month}-${day}`;
    },
    editRoom(item) {
      this.editedRoom = item;
      this.showeditRoom = true;
    },
    openbookingsummary() {
      let self = this;
      self.dialogMode = "booking";
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
      //ตรวจสอบวันที่
      if (
        new Date(self.editedPromotion.end_date) <=
        new Date(self.editedPromotion.start_date)
      ) {
        Swal.fire({
          icon: "warning",
          title: "วันที่ไม่ถูกต้อง",
          text: "วันที่สิ้นสุดต้องมากกว่าวันที่เริ่มต้น",
        });
        return;
      }

      // ตรวจสอบส่วนลด
      if (
        isNaN(self.editedPromotion.discount) ||
        self.editedPromotion.discount <= 0
      ) {
        Swal.fire({
          icon: "warning",
          title: "ส่วนลดไม่ถูกต้อง",
          text: "กรุณากรอกส่วนลดให้ถูกต้อง",
        });
        return;
      }

      let temp = {
        id: self.editedPromotion.id,
        promotion: self.editedPromotion.promotion,
        start_date: self.ChangeDate(self.editedPromotion.start_date), 
        end_date: self.ChangeDate(self.editedPromotion.end_date),     
        discount: self.editedPromotion.discount,
        status: self.editedPromotion.status,
      };
      console.log(temp);
      axios
        .post(`${self.url}Settings/SavePromotion`, temp)
        .then((response) => {
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "บันทึกข้อมูลสำเร็จ",
            });
            self.GetPromotion();
            self.showeditPromotion = false;
          }
        })
        .catch(async function (error) {
          Swal.fire({
            icon: "error",
            title: "ไม่สามารถบันทึกข้อมูลได้",
            text: error.response?.data?.message || "กรุณาลองใหม่อีกครั้ง",
          });
        });
    },
    async GetPromotion() {
      let self = this;
      await axios
        .get(`${self.url}Settings/GetPromotion`)
        .then(function (response) {
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
    SaveRoomDatanew() {
      let self = this;
      let temp = {
        id: self.editedRoom.id,
        room_type: self.editedRoom.room_type,
        room_price: self.editedRoom.room_price,
        status: self.editedRoom.status,
      };
      axios
        .post(`${self.url}Settings/SaveRoomDatanew`, temp)
        .then((response) => {
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "บันทึกข้อมูลสำเร็จ",
            });
            self.GetDataRoom();
            self.showeditRoom = false;
          }
        })
        .catch(async function (error) {
          Swal.fire({
            icon: "error",
            title: "ไม่สามารถบันทึกข้อมูลได้",
            text: error.response?.data?.message || "กรุณาลองใหม่อีกครั้ง",
          });
        });
    },
    async GetDataRoom() {
      let self = this;
      await axios
        .get(`${self.url}Settings/GetRoom`)
        .then(function (response) {
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
    async AutoCheckout() {
      let self = this;
      await axios
        .get(`${self.url}Booking/AutoCheckout`)
        .then(function () {})
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
      Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณต้องการเช็คเอ้าท์การจองนี้!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ใช่, เช็คเอ้าท์!",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .post(`${self.url}Booking/Checkout`, temp)
            .then(function (response) {
              if (response.data.status === 0) {
                Swal.fire(
                  "เช็คเอ้าท์สำเร็จ!",
                  "การจองของคุณถูกเช็คเอ้าท์แล้ว.",
                  "success"
                );
                self.GetDataBooking();
                self.ReloadPage();
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
    getCurrentDateTime() {
      const now = new Date();
      return now.toLocaleString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
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

/* Form Fields */
.v-text-field.v-text-field--outlined .v-input__control {
  min-height: 48px !important;
  transition: all 0.3s ease;
}

.v-text-field--outlined fieldset {
  border-radius: 12px !important;
  transition: all 0.3s ease;
}

.v-text-field--outlined:hover fieldset {
  border-color: rgba(33, 150, 243, 0.5) !important;
}
.v-app-bar {
  backdrop-filter: blur(15px);
  background: linear-gradient(
    45deg,
    rgba(25, 118, 210, 0.95),
    rgba(33, 150, 243, 0.95)
  ) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.v-toolbar-title {
  font-size: 1.5rem !important;
  font-weight: 700 !important;
  background: linear-gradient(45deg, #ffffff, #e3f2fd);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.v-icon {
  transition: all 0.3s ease !important;
}

.v-icon.success {
  color: green !important;
  text-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
}

.v-icon.error {
  color: red !important;
  text-shadow: 0 0 8px rgba(244, 67, 54, 0.3);
}

.v-container {
  padding: 28px !important;
}

.v-row {
  margin: -16px;
}

.v-col {
  padding: 16px;
}

.v-progress-linear__indeterminate {
  animation-duration: 2s;
}

.v-select__selections {
  transition: all 0.3s ease;
}

.v-select:hover .v-select__selections {
  transform: translateX(4px);
}

.income-card {
  height: 100%;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.income-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.income-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.income-amount {
  font-family: "Kanit", "Roboto", sans-serif;
  font-size: 1.75rem;
  letter-spacing: 0.5px;
}

.income-label {
  font-family: "Kanit", "Roboto", sans-serif;
}

.refresh-btn {
  opacity: 0.7;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  opacity: 1;
  transform: rotate(180deg);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.v-card-title .v-icon {
  opacity: 0.9;
}

.income-content .text-h2 {
  background: linear-gradient(45deg, #1976d2, #2196f3);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}
</style>


<!-- :min="new Date().toISOString().substr(0, 10)" -->
 