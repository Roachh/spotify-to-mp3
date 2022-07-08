export default async function searchTracks(playlistID, token) {
  let playlistParameters = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  const result = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
    playlistParameters
  );
  const data = await result.json();
  return await data.items;
}
