<template>
  <b-container class="app my-5">
    <header>
      <h1><img src="/logo.png" width="96px" />Recon Note</h1>
      <div class="logo--container" @click="redirectToHome">
        <Logo />
      </div>
    </header>
    <b-row>
      <b-col class="col-12 col-md-3 mb-4">
        <b-nav pills vertical class="shadow-lg rounded">
          <b-nav-item
            v-for="(navItem, index) in navState"
            :key="index"
            :active="navItem.isActive === true ? true : false"
            @click="SET_ACTIVE_PAGE(index)"
          >
            {{ navItem.entryName }}
          </b-nav-item>
        </b-nav>
      </b-col>

      <b-col class="col-12 col-md-9">
        <component :is="activeComponent.component" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Logo from '../components/Logo.vue';
import AddTargetForm from '../components/AddTargetForm.vue';
import ShowResults from '../components/ShowResults.vue';
import DetailedResults from '../components/DetailedResults.vue';

export default {
  name: 'App',
  components: { AddTargetForm, ShowResults, DetailedResults, Logo },
  computed: {
    ...mapState(['navState']),
    activeComponent() {
      let ret = {};
      ret = this.navState.find((element) => element.isActive === true);
      return ret;
    },
  },
  methods: {
    ...mapActions(['SET_ACTIVE_PAGE']),
    redirectToHome() {
      this.$store.dispatch('SET_ACTIVE_PAGE', 0);
    },
  },
};
</script>

<style>
body {
  background-color: #1e272e;
  color: #ffffff;
}

header {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header h1 {
  text-transform: uppercase;
  font-family: 'Open Sans';
  font-weight: 700;
  font-size: 2rem;
  margin-left: -39px;
}

.logo--container {
  height: 40px;
}

header svg {
  width: auto;
  height: 100%;
  cursor: pointer;
  transition: all 0.4s ease;
}
header svg:hover {
  transform: scale(0.95);
}

.nav-pills .nav-link {
  color: #fff;
  outline: none;
  text-transform: uppercase;
}

.nav-pills .nav-link.active {
  background-color: #01b662;
  color: #ffffff;
}

.nav-pills label:active,
.nav-pills label:focus {
  background-color: #01b662;
}
</style>
