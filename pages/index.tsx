import { Button, Container, Grid, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import searchTracks from "../lib/searchTracks";

const CGrid = styled(Grid)`
  padding-top: 150px;
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

export default function Home({ token }) {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");

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

      <Grid container></Grid>
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
