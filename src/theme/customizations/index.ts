import { Theme } from "@mui/material/styles";
import Backdrop from "./Backdrop";
import Card from "./Card";
import CssBaseline from "./CssBaseline";
import Input from "./Input";
import Link from "./Link";
import Paper from "./Paper";
import Skeleton from "./Skeleton";
import Tooltip from "./Tooltip";
import Typography from "./Typography";

function customizeComponents(theme: Theme) {
  return Object.assign(
    Link(theme),
    Card(theme),
    Input(theme),
    Paper(theme),
    Tooltip(theme),
    Backdrop(theme),
    Typography(theme),
    CssBaseline(theme),
    Skeleton(theme)
  );
}

export default customizeComponents;
