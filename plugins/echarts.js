import Vue from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  GridComponent,
  AxisPointerComponent,
  LegendComponent,
  ToolboxComponent,
  TooltipComponent,
  TimelineComponent,
  GraphicComponent,
  VisualMapComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  GridComponent,
  AxisPointerComponent,
  LegendComponent,
  ToolboxComponent,
  TooltipComponent,
  TimelineComponent,
  GraphicComponent,
  VisualMapComponent,
])

Vue.component('VChart', VChart)
