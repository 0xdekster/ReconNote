import axios from 'axios';
let ls = null;

export const state = () => ({
  resultItems: [],
  lastResultIdInContext: 0,
  lastResultData: {
    websiteHostname: '',
    subdomains: [],
    ports: [],
    screens: [],
    js_files: [],
    other_links: [],
  },
  navState: [
    {
      entryName: 'Add Targets',
      isActive: true,
      component: 'AddTargetForm',
    },
    {
      entryName: 'Show Results',
      isActive: false,
      component: 'ShowResults',
    },
    {
      entryName: 'Detailed Results',
      isActive: false,
      component: 'DetailedResults',
    },
  ],
});

export const getters = {
  resultItemsToDisplay(state) {
    return [...state.resultItems].reverse();
  },
};

export const mutations = {
  addTarget(state, options) {
    const resultItems = [...state.resultItems];
    resultItems.push({
      uuid: (Math.random() * 50000).toFixed(0),
      websiteAddress: options.url,
      scanType: options.scanType,
      status: 'Running',
      timestamp: String(new Date().getTime()),
    });
    state.resultItemzs = resultItems;
  },

  updateResults(state, resultItems) {
    state.resultItems = resultItems;
  },

  setActivePage(state, pageIndex) {
    const newNavState = [...state.navState];
    newNavState.forEach((element) => {
      element.isActive = false;
    });
    newNavState[pageIndex].isActive = true;
    state.navState = newNavState;
  },

  setActiveResultId(state, resultID) {
    state.lastResultIdInContext = resultID;
  },

  setActiveResultData(state, resultData) {
    state.lastResultData = resultData;
  },
};

export const actions = {
  ADD_TARGET: ({ commit }, options) => {
    commit('addTarget', options);
  },

  FETCH_NEW_RESULTS({ commit }, options) {
    this.$axios.$get('/api/results').then((res) => {
      commit('updateResults', res);
    });
  },

  SET_ACTIVE_PAGE({ commit }, pageIndex) {
    commit('setActivePage', pageIndex);
  },

  SET_ACTIVE_RESULT_ID({ commit }, resultId) {
    commit('setActiveResultId', resultId);
  },

  GET_RESULT_DETAIL({ commit, state }, resultId) {
    this.$axios
      .$get('/api/getScanDetails', {
        params: { resultId: state.lastResultIdInContext },
      })
      .then((res) => {
        commit('setActiveResultData', res);
      });
  },
};
