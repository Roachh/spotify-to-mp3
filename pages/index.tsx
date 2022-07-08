import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import searchTracks from "../lib/searchTracks";

const CGrid = styled(Grid)`
  padding-top: 50px;
  justify-content: center;
`;

const CButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`;

const CTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const CCard = styled(Card)`
  background-color: #2d3036f6;
  color: white;
  margin-bottom: 5px;
  box-shadow: 0px 2px 5px #2d3036f6;
`;

export default function Home({ token }) {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [songs, setSongs] = useState([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  useEffect(() => {
    setAccessToken(token);
    console.log(`token: ${token}`);
  }, []);

  async function search() {
    const tracks = await searchTracks(searchInput, accessToken);
    setSongs(tracks);
  }

  return (
    <Container>
      <CGrid container>
        <CTextField
          label="Playlist ID"
          variant="outlined"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              search();
            }
          }}
          value={searchInput}
          onChange={handleChange}
        />
        <CButton variant="contained" onClick={search}>
          Search
        </CButton>
      </CGrid>
      <Grid
        container
        alignItems={"center"}
        flexDirection={"column"}
        paddingTop={"45px"}
      >
        {songs &&
          songs.map((song, i) => {
            return (
              <Container key={i}>
                <CCard sx={{ minWidth: 400 }} variant="outlined" raised={true}>
                  <CardContent>
                    <Typography sx={{ fontSize: 14 }} gutterBottom>
                      {song.track.artists[0].name}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {song.track.name}
                    </Typography>
                  </CardContent>
                </CCard>
              </Container>
            );
          })}
      </Grid>
    </Container>
  );
}

export async function getServerSideProps() {
  var authParameters = {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`,
  };

  let result = await fetch(
    "https://accounts.spotify.com/api/token",
    authParameters
  );
  let data = await result.json();
  let token = await data.access_token;

  return { props: { token } };
}
