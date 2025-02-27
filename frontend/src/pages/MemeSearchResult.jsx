import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Switch,
  FormControlLabel,
  CircularProgress,
  FormGroup,
  FormControl,
} from "@mui/material";
import { COLOUR_PALETTE } from "../assets/constants";

const ResultPage = () => {
  const location = useLocation();
  const { test_result } = location.state || [];
  const [labels, setLabels] = useState([]);
  const [popularity, setPopularity] = useState([]);
  const [clusterSize, setClusterSize] = useState([]);
  const [sortByPopularity, setSortByPopularity] = useState(false); // Toggle state for sorting by popularity
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      const labelsArray = [];
      const popularityArray = [];
      const clusterSizeArray = [];
      for (let i = 0; i < test_result.length; i++) {
        let filename = "cluster_" + test_result[i];
        try {
          const response = await fetch(
            (process.env.REACT_APP_BACKEND_URL || "http://localhost:5000") +
              "/clusters/" +
              filename
          );
          if (!response.ok) {
            throw new Error("Bad response");
          }
          const data = await response.json();
          labelsArray.push(data.popularityCurve.label);
          popularityArray.push(
            data.popularityCurve.data.reduce((x, y) => x + y, 0)
          );
          clusterSizeArray.push(data.clusterList.length);
        } catch (err) {
          console.log(err);
        }
      }
      setLabels(labelsArray);
      setPopularity(popularityArray);
      setClusterSize(clusterSizeArray);
      setLoading(false); // Set loading to false after data is fetched
    };
    fetchData();
  }, [test_result]);

  const sortedResults = [...labels]
    .map((label, index) => ({
      label,
      popularity: popularity[index],
      clusterSize: clusterSize[index],
      id: test_result[index],
    }))
    .sort((a, b) => {
      if (sortByPopularity) {
        return b.popularity - a.popularity; // Descending order
      }
      return test_result.indexOf(a.id) - test_result.indexOf(b.id); // Default order
    });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "80vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <h1 style={{ marginBottom: "10px" }}>Meme Search Results</h1>
        <FormControl component="fieldset">
          <FormGroup row style={{ alignItems: "center" }}>
            <span style={{ marginRight: "10px" }}>
              Sort by Nearest Meme Cluster
            </span>
            <FormControlLabel
              control={
                <Switch
                  checked={sortByPopularity}
                  onChange={() => setSortByPopularity(!sortByPopularity)}
                  name="sortToggle"
                  color="primary"
                />
              }
              labelPlacement="start"
              style={{ marginRight: "10px" }}
            />
            <span>Sort by Meme Volume</span>
          </FormGroup>
        </FormControl>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            {sortedResults.map((result, index) => (
              <li key={index} style={{ marginBottom: "20px" }}>
                <span style={{ fontSize: "1.4em", fontWeight: "bold" }}>
                  {index + 1}.{" "}
                  <Link to={`/meme/${result.id}`}>{result.label}</Link>
                </span>
                <p>
                  Meme Volume: {result.popularity}, Cluster Size:{" "}
                  {result.clusterSize}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
