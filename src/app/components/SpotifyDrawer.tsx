import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import SpotifyPlayer from "./SpotifyEmbedded";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import { useEffect } from "react";

type Anchor = "right";

interface SpotifyDrawerProps {
  stress: number;
}

export default function SpotifyDrawer({ stress }: SpotifyDrawerProps) {
  const [state, setState] = React.useState({
    right: false,
  });

  useEffect(() => {
    setState({
      ...state,
      right: false,
    });
  }, [stress]);

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: 400, height: "100vh", borderRadius: "0.75rem" }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div
        style={{
          height: "100%",
          zIndex: 100000,
        }}
      >
        <SpotifyPlayer playlistId="6lHIfp4RnvAoXxSeLzIY49" />
      </div>
    </Box>
  );

  return (
    <div>
      {(["right"] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            <LibraryMusicIcon />
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
