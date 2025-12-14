<template>
  <div class="network-visualization">
    <div class="hex-grid">
      <div class="hex-node center">
        <v-icon
          size="24"
          color="success"
        >
          mdi-shield-check
        </v-icon>
      </div>

      <div class="hex-node node-1">
        <v-icon
          size="16"
          color="success"
        >
          mdi-check-circle
        </v-icon>
      </div>
      <div class="hex-node node-2">
        <v-icon
          size="16"
          color="warning"
        >
          mdi-alert-circle
        </v-icon>
      </div>
      <div class="hex-node node-3">
        <v-icon
          size="16"
          color="error"
        >
          mdi-close-circle
        </v-icon>
      </div>
      <div class="hex-node node-4">
        <v-icon
          size="16"
          color="info"
        >
          mdi-information-outline
        </v-icon>
      </div>
      <div class="hex-node node-5">
        <v-icon
          size="16"
          color="success"
        >
          mdi-shield-check
        </v-icon>
      </div>
      <div class="hex-node node-6">
        <v-icon
          size="16"
          color="primary"
        >
          mdi-network
        </v-icon>
      </div>
    </div>

    <svg
      class="connection-lines"
      viewBox="0 0 400 300"
    >
      <line
        x1="200"
        y1="150"
        x2="200"
        y2="45"
        stroke="rgba(76, 175, 80, 0.4)"
        stroke-width="2"
        class="connection-line line-1"
      />
      <line
        x1="200"
        y1="150"
        x2="328"
        y2="105"
        stroke="rgba(255, 193, 7, 0.4)"
        stroke-width="2"
        class="connection-line line-2"
      />
      <line
        x1="200"
        y1="150"
        x2="328"
        y2="195"
        stroke="rgba(244, 67, 54, 0.4)"
        stroke-width="2"
        class="connection-line line-3"
      />
      <line
        x1="200"
        y1="150"
        x2="200"
        y2="255"
        stroke="rgba(33, 150, 243, 0.4)"
        stroke-width="2"
        class="connection-line line-4"
      />
      <line
        x1="200"
        y1="150"
        x2="72"
        y2="195"
        stroke="rgba(76, 175, 80, 0.4)"
        stroke-width="2"
        class="connection-line line-5"
      />
      <line
        x1="200"
        y1="150"
        x2="72"
        y2="105"
        stroke="rgba(76, 175, 80, 0.4)"
        stroke-width="2"
        class="connection-line line-6"
      />
    </svg>
  </div>
</template>

<style lang="scss" src="./NetworkVisualization.scss" scoped />
