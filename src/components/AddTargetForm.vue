<template>
  <div class="form--container shadow-lg p-3 p-md-5">
    <h2>Add Target</h2>
    <label>Enter the domain to scan:</label>
    <input
      id="input-small"
      v-model="url"
      type="text"
      class="form-control text-left mb-5"
    />
    <p class="font-italic text-center">Type Of Scan - Select Type Of Scan</p>
    <div class="btn-container d-block">
      <div>
        <div class="btn-group btn-group-toggle" data-toggle="buttons">
          <label
            v-for="(scanType, index) in scanTypes"
            :key="scanType.name"
            :class="getScanTypeActiveClass(index, scanType)"
            :for="`option-` + scanType.name"
            @click="setScanType(index)"
          >
            <input
              type="radio"
              :name="`option-` + scanType.name"
              autocomplete="off"
            />
            {{ scanType.title }}
          </label>
        </div>
      </div>
    </div>

    <div id="startBtn-container">
      <b-button class="shadow-lg" @click="startScan">Start Scanning</b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddTargetForm',

  data() {
    return {
      url: 'example.com',
      scanTypes: [
        {
          name: 'port_scan',
          title: 'Port Scan',
          isActive: true,
        },
        {
          name: 'screenshots',
          title: 'Screenshot Scan',
          isActive: false,
        },
        {
          name: 'full_scan',
          title: 'Full Scan',
          isActive: false,
        },
      ],
    };
  },

  computed: {
    getSelectedScanTypeIndex() {
      return this.scanTypes.findIndex((scanType) => {
        return scanType.isActive === true;
      });
    },
  },

  methods: {
    setScanType(index) {
      const newScanTypesState = this.scanTypes;
      newScanTypesState.forEach((scanType) => {
        scanType.isActive = false;
      });
      newScanTypesState[index].isActive = true;
      this.scanTypes = newScanTypesState;
    },

    getScanTypeActiveClass(index, scanType) {
      let classNames = `btn ${scanType.name} `;
      if (this.getSelectedScanTypeIndex === index) {
        classNames += ' active';
      }
      return classNames;
    },

    startScan() {
      const scanType = this.scanTypes[this.getSelectedScanTypeIndex];

      this.$axios
        .$get('/api/addScan', {
          params: {
            url: this.url,
            scanType: scanType.name,
          },
        })
        .then((res) => {
          this.$store.dispatch('ADD_TARGET', {
            url: this.url,
            scanType: scanType.name,
          });
          this.$store.dispatch('SET_ACTIVE_PAGE', 1);
        });
    },
  },
};
</script>

<style lang="css">
h4 {
  margin: 20px 0;
}
:root {
  --background-color: #01b662;
  --border: 3px solid #01b662;
}

.form--container > * {
  margin-bottom: 20px;
  text-align: center;
}

.btn-container label {
  background-color: #01b662;
  color: var(--white);
}

.btn-container label.active,
.btn-container label:hover {
  background-color: #049953;
  color: var(--white);
}
#startBtn-container button {
  background-color: #049953;
  color: #fff;
  border: 3px solid #01b662;
  font-size: 1.1rem;
  width: 50%;
}
#startBtn-container button:active,
#startBtn-container button:hover,
#startBtn-container button:focus {
  background-color: var(--background-color);
  border: var(--border);
  outline: none;
  box-shadow: none;
  -webkit-box-shadow: none;
}
.form--container label {
  margin-bottom: 0.5rem;
}
</style>
