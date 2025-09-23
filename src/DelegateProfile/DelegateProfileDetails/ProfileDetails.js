import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import DelegateNavbar from "../DelegateNavbar/DelegateNavbar";
import { AuthContext } from "../../Components/AuthContext/AuthContext";
import baseURL from "../../Components/ApiUrl/Apiurl";
import { useNavigate } from "react-router-dom"; // Add this import

const ProfileDetails = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize navigate
  const [profile, setProfile] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add null check for user
  useEffect(() => {
    if (!user) {
      // If user is null, redirect to login
      navigate("/");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      // Check if user exists before making API call
      if (!user || !user.delegate_id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${baseURL}/delegates/${user.delegate_id}/`
        );
        setProfile(response.data.data);
      } catch (err) {
        setError("Failed to fetch delegate details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]); // Depend on user instead of delegate_id

  // Show loading or redirect if user is null
  if (!user) {
    return <p>Redirecting to login...</p>;
  }

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>Delegate Profile</h2>
      {profile ? (
        <div style={styles.card}>
          <p><strong>ID:</strong> {profile.delegate_id}</p>
          <p><strong>Name:</strong> {profile.delegate_name}</p>
          <p><strong>Email:</strong> {profile.delegate_email}</p>
          <p><strong>Mobile:</strong> {profile.delegate_mobile}</p>
          <p><strong>Status:</strong> {profile.status}</p>
          <p><strong>Company:</strong> {profile.company}</p>
          <p><strong>Customer:</strong> {profile.customer}</p>
          <p>
            <strong>Registered At:</strong>{" "}
            {new Date(profile.registered_at).toLocaleString()}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {new Date(profile.updated_at).toLocaleString()}
          </p>
        </div>
      ) : (
        <p>No profile found.</p>
      )}

      <DelegateNavbar/>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "#f9f9f9",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    lineHeight: "1.8",
  },
};

export default ProfileDetails;