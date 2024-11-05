<template>
  <!-- receipt print section -->
  <!-- normal version -->
  <div class="hidden" id="print-nota">
    <div style="font-size: 13px" class="font-monospace mx-auto p-0">
      <!-- comment this to pelit version -->
      <div
        class="d-flex flex-column align-items-center mb-3 pb-4"
        style="border-bottom: 1px dashed">
        <div>{{ returnBeli.header }}</div>
        <div>{{ useAuthStore().alamat }}</div>
        <div>{{ returnBeli.no_hp }}</div>
      </div>
      <!--  -->
      <div class="mb-3" style="border-bottom: 1px dashed">
        <table class="table table-borderless table-sm">
          <tbody style="font-size: 13px">
            <tr>
              <td>No. Nota</td>
              <td>: {{ returnBeli.nota_id }}</td>
            </tr>
            <tr>
              <td>Waktu</td>
              <td>: {{ useFormat.receiptDateFormat(returnBeli.date) }}</td>
            </tr>
            <tr>
              <td>Keterangan</td>
              <td>: {{ returnBeli.payment_note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mb-1" style="border-bottom: 1px dashed">
        <table class="table table-borderless table-sm">
          <tbody style="font-size: 13px">
            <tr v-for="items in returnBeli.items" :key="items.index">
              <td>{{ items.quantity }}x</td>
              <td class="d-flex gap-1">
                <div class="text-capitalize">{{ items.name }}</div>
                <div>({{ items.satuan }})</div>
              </td>
              <td class="text-end">
                {{ useFormat.currencyFormat(items.total_price) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mb-2 d-flex justify-content-end">
        <table>
          <tbody style="font-size: 13px">
            <tr>
              <td>TOTAL</td>
              <td>: {{ useFormat.currencyFormat(returnBeli.final_price) }}</td>
            </tr>
            <tr>
              <td>BAYAR</td>
              <td>: {{ useFormat.currencyFormat(returnBeli.payment) }}</td>
            </tr>
            <tr>
              <td>KEMBALI</td>
              <td>: {{ useFormat.currencyFormat(returnBeli.changes) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="d-flex flex-column align-items-center mb-4"
        style="font-size: 13px">
        <div>Powered by</div>
        <div>kasirgue.com</div>
      </div>
      <!-- uncomment below for pelit version -->
      <!-- <div
        class="d-flex flex-column align-items-center mb-3 pb-4"
        style="border-bottom: 1px dashed"
      >
        <div>PT. Acme Indonesia</div>
        <div>Jalan Sana-Sini No.14</div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { useUseFormat } from "@/stores/useFormat";
export default {
  setup() {
    const useFormat = useUseFormat();
    return { useFormat };
  },
  props: {
    returnBeli: {
      type: Array,
      default: null,
    },
  },
  methods: {
    getDataToPrint(data) {
      this.returnBeli = data;
    },
  },
};
</script>
