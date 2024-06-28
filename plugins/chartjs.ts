import {
  Chart,
  Title,
  Tooltip,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
export default defineNuxtPlugin(() => {
  Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip
  );
});
