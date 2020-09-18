<template>
  <div class="detailed-results-container shadow-lg rounded py-3">
    <h2 class="results__heading text-center mt-3 mt-md-0">Scan Results</h2>
    <div class="scan-info text-white mx-2 mx-sm-5">
      <h5 class="text-center my-3">
        <em>{{ lastResultData.websiteHostname }}</em>
      </h5>
      <p class="text-center text-md-left mx-3 mx-lg-4">
        Scan Type : <em>{{ lastResultData.scanType }}</em>
      </p>
      <p class="text-center text-md-left mx-3 mx-lg-4">
        Time :
        <em>
          <small>{{ new Date(lastResultData.timestamp) }}</small>
        </em>
      </p>
      <p class="text-center text-md-left mx-3 mx-lg-4">
        Status:
        <em>{{ lastResultData.status }}</em>
      </p>
    </div>

    <div class="results-table">
      <div
        v-for="(subHostData, name, index) in lastResultData.subHosts"
        :key="index"
        class="px-lg-4 py-3 mx-lg-4 mb-lg-4 result-row shadow-lg px-2 px-sm-3 mx-1 mx-md-3 mb-4"
      >
        <div class="row-1 flex-column flex-md-row">
          <div class="hostname">
            <h6>
              <span>{{ index + 1 }}.</span>
              <a :href="name" target="_blank">{{ name }}</a>
            </h6>
          </div>
          <div class="ports my-2 my-lg-0">
            <span
              v-for="(port, index) in subHostData.ports"
              :key="index"
              id="port"
              class="m-1 py-1 px-2"
            >
              {{ port }}
            </span>
          </div>
          <div
            class="screenshots flex-column flex-sm-row flex-md-column flex-lg-row"
          >
            <a
              v-for="(screenshot, index) in subHostData.screenshots"
              :key="index"
              :href="screenshot"
              target="_blank"
              rel="noopener noreferrer"
              class="m-1 m-md-2"
            >
              <img
                :src="screenshot"
                alt="screenshot"
                class="img-fluid img-thumbnail screenshot"
              />
            </a>
          </div>
        </div>
        <div class="row-accordion ml-auto">
          <template
            v-if="subHostData.js_files && subHostData.js_files.length > 0"
          >
            <b-button
              v-b-toggle="'collapse-js-files-' + index"
              id="tab1"
              class="m-1 shadow-lg rounded"
            >
              JS Files
              <small>
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  class="bi bi-caret-down-fill"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  transform="translate(2,-3)"
                >
                  <path
                    d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
                  />
                </svg>
              </small>
            </b-button>

            <b-collapse :id="'collapse-js-files-' + index">
              <b-card id="card1">
                <p
                  v-for="(js_file_url, index) in subHostData.js_files"
                  :key="index"
                >
                  <a
                    :href="js_file_url"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ js_file_url }}
                  </a>
                </p>
              </b-card>
            </b-collapse>
          </template>

          <template
            v-if="subHostData.other_links && subHostData.other_links.length > 0"
          >
            <b-button
              v-b-toggle="'collapse-other-link-' + index"
              id="tab2"
              class="m-1 shadow-lg rounded"
            >
              HTTPX Links
              <small>
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  class="bi bi-caret-down-fill"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  transform="translate(2,-3)"
                >
                  <path
                    d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
                  />
                </svg>
              </small>
            </b-button>

            <b-collapse :id="'collapse-other-link-' + index">
              <b-card id="card2">
                <div
                  v-for="(other_links_url, index) in subHostData.other_links"
                  :key="index"
                  id="other_links_container"
                  class="shadow py-2 px-3 m-2"
                >
                  <p>
                    Title:
                    <em>{{ other_links_url.title }}</em>
                  </p>
                  <p>
                    Url:
                    <a
                      :href="other_links_url.url"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {{ other_links_url.url }}
                    </a>
                  </p>
                  <p>
                    Status:
                    <em>{{ other_links_url['status-code'] }}</em>
                  </p>
                  <p>
                    Content Length:
                    <em>{{ other_links_url['content-length'] }}</em>
                  </p>
                </div>
              </b-card>
            </b-collapse>
          </template>

          <template
            v-if="
              subHostData.dirSearchPaths &&
              subHostData.dirSearchPaths.length > 0
            "
          >
            <b-button
              v-b-toggle="'collapse-dirSearchPath-' + index"
              id="tab3"
              class="m-1 shadow-lg rounded"
            >
              Dir Search Paths
              <small>
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  class="bi bi-caret-down-fill"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  transform="translate(2,-3)"
                >
                  <path
                    d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
                  />
                </svg>
              </small>
            </b-button>

            <b-collapse :id="'collapse-dirSearchPath-' + index">
              <b-card id="card3">
                <p
                  v-for="(dirSearchPaths_url,
                  index) in subHostData.dirSearchPaths"
                  :key="index"
                >
                  <a
                    :href="dirSearchPaths_url.url"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ dirSearchPaths_url.url }}
                  </a>
                </p>
              </b-card>
            </b-collapse>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DetailedResults',

  computed: {
    lastResultData() {
      console.log(this.$store.state.lastResultData);
      return this.$store.state.lastResultData || {};
    },
  },
  mounted() {
    this.$store.dispatch('GET_RESULT_DETAIL');
  },
};
</script>
<style>
.detailed-results-container div {
  background-color: transparent;
}
h5 {
  color: #11f088;
}
.scan-info h5 em {
  border: 1px dashed #11f088;
  text-align: center;
  padding: 0.3rem 0.5rem;
}

.result-row {
  border-radius: 10px;
  border: 1px solid #475663;
}

.row-1 {
  display: flex;
  margin: 0 0 20px;
  justify-content: space-around;
  align-items: flex-start;
}

.row-1 .hostname {
  flex: 0 1 35%;
}

.row-1 .ports {
  flex: 0 1 25%;
}

.row-accordion p {
  margin-bottom: 5px;
  font-size: 0.8em;
}
h6 a,
a,
p em {
  color: #049953;
}
.hostname h6 {
  display: inline-block;
  font-size: 1.04rem;
  //word-wrap: break-word;
  //overflow-wrap: anywhere;
}
.hostname h6 a {
  text-decoration: underline;
}
a:hover,
a:focus,
a:active {
  color: #11f088;
  text-underline-color: #11f088;
}
.ports {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  margin: 0 auto;
}
#port {
  background-color: transparent;
  color: #11f088;
  display: inline-block;
  font-size: 0.83rem;
  border-radius: 15px;
  border: 1px solid #495057;
  -webkit-box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.5);
}
.screenshots {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  //flex-wrap: wrap;
}
.screenshots a {
  width: 130px;
  max-width: 130px;
  max-height: 80px;
  overflow: hidden;
  display: inline-block;
  border-radius: 3px;
}
.screenshot {
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
  transform: scale(1);
}
.screenshot:hover {
  transform: scale(1.1);
}
#tab1,
#tab2,
#tab3 {
  background: transparent;
  -webkit-box-shadow: none;
  border: 0.001em solid #475663;
  //border: none;
  text-align: left;
  text-decoration-color: #11f088;
  color: #11f088;
  font-size: 1rem;
  text-transform: uppercase;
  transition: all 0.1s ease-out;
  -webkit-box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.5);
  transform: translateX(0px);
}
#tab1:hover,
#tab2:hover,
#tab3:hover {
  transform: translateX(3px);
}
#card1 p a,
#card2 p a,
#card3 p a {
  color: #049953;
}
#card1 p a:hover,
#card2 p a:hover,
#card3 p a:hover {
  color: #11f088;
  text-underline-color: #11f088;
}
#other_links_container {
  //border: 1px solid #475663;
}
#other_links_container p {
  font-size: 14px;
  color: #cecece;
}
</style>
