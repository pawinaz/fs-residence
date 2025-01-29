<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>FS Residence</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-text-field
        dense
        outlined
        hide-details
        prepend-inner-icon="mdi-magnify"
        placeholder="Search..."
        class="mr-4"
        style="max-width: 300px"
      ></v-text-field>
      <v-btn icon class="ml-2"><v-icon>mdi-cog</v-icon></v-btn>
      <!-- <v-avatar class="ml-4" color="grey" size="36">
        <v-icon dark>mdi-account</v-icon>
      </v-avatar> -->
    </v-app-bar>

    <v-main class="grey lighten-4">
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title class="headline">
                BOOK HOTEL
                <v-spacer></v-spacer>
              </v-card-title>
              
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-data-table
                      :headers="headers"
                      :items="bookings"
                      class="elevation-1"
                    >
                      <template #[`item.status`]="{ item }">
                        <v-chip
                          :color="getStatusColor(item.status)"
                          small
                        >
                          {{ item.status }}
                        </v-chip>
                      </template>
                      
                      <template #[`item.actions`]="{ item }">
                        <v-icon
                          small
                          class="mr-2"
                          @click="editBooking(item)"
                        >
                          mdi-pencil
                        </v-icon>
                        <v-icon
                          small
                          @click="deleteBooking(item)"
                        >
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
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'HotelUI',
  data: () => ({
    dialog: false,
    headers: [
      { text: 'CHECK-IN DATE', value: 'checkin' },
      { text: 'CHECK-OUT DATE', value: 'checkout' },
      { text:'ROOM TYPE',value:'roomtype',sortable: false },
      { text: 'EDIT', value: 'actions', sortable: false }
    ],
    // bookings: [
    //   {
    //     id: '001',
    //     name: 'สมชาย ใจดี',
    //     room: '101',
    //     checkin: '2025-01-28',
    //     checkout: '2025-01-30',
    //     status: 'จองแล้ว'
    //   },
    //   {
    //     id: '002',
    //     name: 'สมหญิง รักดี',
    //     room: '102',
    //     checkin: '2025-01-29',
    //     checkout: '2025-02-01',
    //     status: 'เช็คอินแล้ว'
    //   },
    //   {
    //     id: '003',
    //     name: 'มานี มีเงิน',
    //     room: '103',
    //     checkin: '2025-01-30',
    //     checkout: '2025-02-02',
    //     status: 'รอเช็คอิน'
    //   }
    // ]
  }),

  methods: {
    getStatusColor(status) {
      switch (status) {
        case 'จองแล้ว':
          return 'blue'
        case 'เช็คอินแล้ว':
          return 'green'
        case 'รอเช็คอิน':
          return 'orange'
        default:
          return 'grey'
      }
    },

    editBooking(item) {
      console.log('แก้ไขการจอง:', item)
    },

    deleteBooking(item) {
      console.log('ลบการจอง:', item)
    }
  }
}
</script>