<template>
  <div class="results-container shadow-lg p-1 p-sm-3 p-lg-5">
    <h2 class="results__heading text-center mt-3 mt-md-0">Results</h2>
    <div
      v-for="resultItem in resultItemsToDisplay"
      :key="resultItem.uuid"
      class="result-item shadow-lg border-secondary p-3 p-lg-4"
    >
      <b-row>
        <b-col
          id="resultData"
          class="col-12 col-md-9 text-center text-md-left"
          @click="handleResultClick(resultItem.dir)"
        >
          <h5>{{ resultItem.websiteAddress }}</h5>
          <small>Started on {{ getFormattedTime(resultItem.timestamp) }}</small>
          Type of Scan:<i> {{ resultItem.scanType | formatScanType }}</i>
        </b-col>
        <b-col class="col-12 col-md-3 my-md-auto text-center text-md-right">
          <span
            class="result-status__text my-3"
            :class="getStatusColorClass(resultItem.status)"
          >
            {{ resultItem.status }}
          </span>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ShowResults',
  filters: {
    formatScanType(data) {
      if (data === 'port_scan') {
        return 'Port scan';
      } else if (data === 'screenshots') {
        return 'Screenshot scan';
      } else if (data === 'full_scan') {
        return 'Full scan';
      }
      return data;
    },
  },
  computed: mapGetters(['resultItemsToDisplay']),
  mounted() {
    this.$store.dispatch('FETCH_NEW_RESULTS', this);
  },
  methods: {
    handleResultClick(resultID) {
      this.$store.dispatch('SET_ACTIVE_RESULT_ID', resultID);
      this.$store.dispatch('SET_ACTIVE_PAGE', 2);
    },

    getStatusColorClass(status) {
      let classes = 'text-secondary ';

      if (status === 'Successful') {
        classes = 'badge badge-success';
      }

      if (status === 'Scanning') {
        classes = 'badge badge-secondary';
      }

      return classes;
    },

    getFormattedTime(timestamp) {
      return new Date(+timestamp);
    },
  },
};
</script>

<style lang="css" scoped>
.results__heading {
  margin-bottom: 30px;
}

.result-item {
  border-radius: 4px;
  border: 1px solid #eeeeee;
  margin-bottom: 20px;
  cursor: pointer;
}
.result-item:hover {
  background-color: #30373c;
  transform: scale(1.01);
}
#resultData {
  font-size: 0.95rem;
}

.result-item i {
  color: #049953;
}

.result-item h5 {
  color: #11f088;
  font-style: italic;
}
small {
  display: block;
  margin-bottom: 0.8rem;
}

.result-status__text {
  font-weight: bold;
  font-size: 0.9rem;
}

.text-right {
  text-align: right;
}
</style>
