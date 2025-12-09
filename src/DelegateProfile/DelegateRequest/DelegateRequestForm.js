import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from "../../Components/AuthContext/AuthContext";
import DelegateNavbar from "../DelegateNavbar/DelegateNavbar";
import './DelegateRequestForm.css';
import { useNavigate, useLocation } from 'react-router-dom';
import baseURL from '../../Components/ApiUrl/Apiurl';
import { useDelegateServiceItems } from '../../Components/AuthContext/DelegateServiceItemContext';
import Swal from 'sweetalert2';
import axios from 'axios';
import {
  FaTimes,
  FaUpload,
  FaImage,
  FaVideo,
  FaEye,
  FaTrash,
} from "react-icons/fa";


const DelegateRequestForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedServiceItem, serviceItems } = useDelegateServiceItems();

  // Edit mode info
  const isEditMode = location.state?.editMode || false;
  const existingRequest = location.state?.requestData || null;

  const [delegateId, setDelegateId] = useState("");
  const [company, setCompany] = useState("");
  const [customer, setCustomer] = useState("");
  const [serviceItemsList, setServiceItemsList] = useState([]);

  const [formData, setFormData] = useState({
    serviceItem: selectedServiceItem || "",
    preferredDate: "",
    preferredTime: "",
    description: "",
    problemType: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Problem types
  const [problemTypes, setProblemTypes] = useState([]);

  // Media-related state
  const [selectedFiles, setSelectedFiles] = useState([]); // New files to upload
  const [existingMedia, setExistingMedia] = useState([]); // Existing media in edit mode
  const [deletingMedia, setDeletingMedia] = useState([]); // media_ids currently deleting

  // ------------ Fetch Problem Types (same as customer) ------------
  useEffect(() => {
    const fetchProblemTypes = async () => {
      try {
        const response = await fetch(`${baseURL}/problem-types/`);
        if (response.ok) {
          const result = await response.json();
          if (result.status === "success" && Array.isArray(result.data)) {
            setProblemTypes(result.data);
          }
        } else {
          console.error("Failed to fetch problem types");
        }
      } catch (error) {
        console.error("Error fetching problem types:", error);
      }
    };

    fetchProblemTypes();
  }, []);

  // ------------ Fetch Service Items for showing service_item_name ------------
  useEffect(() => {
    if (user?.company_id && user?.delegate_id) {
      axios
        .get(
          `${baseURL}/service-items/?user_id=${user.delegate_id}&company_id=${user.company_id}`
        )
        .then((response) => {
          try {
            const data = Array.isArray(response.data)
              ? response.data
              : response.data?.data && Array.isArray(response.data.data)
              ? response.data.data
              : [];
            setServiceItemsList(data);
          } catch (error) {
            console.error("Error processing service items data:", error);
            setServiceItemsList([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching service items:", error);
          setServiceItemsList([]);
        });
    }
  }, [user?.company_id, user?.delegate_id]);

  // Update formData when selectedServiceItem changes (create mode only)
  useEffect(() => {
    if (selectedServiceItem && !isEditMode) {
      setFormData((prev) => ({
        ...prev,
        serviceItem: selectedServiceItem,
      }));
    }
  }, [selectedServiceItem, isEditMode]);

  // Initialize form with existing data if in edit mode
  useEffect(() => {
    if (isEditMode && existingRequest) {
      setFormData({
        serviceItem: existingRequest.service_item || "",
        preferredDate: existingRequest.preferred_date || "",
        preferredTime: existingRequest.preferred_time
          ? existingRequest.preferred_time.slice(0, 5)
          : "",
        description: existingRequest.request_details || "",
        problemType: existingRequest.problem_type || "",
      });

      if (existingRequest.company) setCompany(existingRequest.company);
      if (existingRequest.customer) setCustomer(existingRequest.customer);
    }
  }, [isEditMode, existingRequest]);

  // Fetch delegate -> company & customer
  useEffect(() => {
    if (user?.delegate_id) {
      setDelegateId(user.delegate_id);

      if (!isEditMode || !company || !customer) {
        fetch(`${baseURL}/delegates/`)
          .then((res) => res.json())
          .then((data) => {
            const match = data?.data?.find(
              (d) => d.delegate_id === user.delegate_id
            );
            if (match) {
              setCompany(match.company || "");
              setCustomer(match.customer || "");
            }
          })
          .catch((err) => {
            console.error("Error fetching delegate data:", err);
          });
      }
    }
  }, [user, isEditMode, company, customer]);

  // ------------ Fetch existing media for edit mode ------------
  useEffect(() => {
    if (isEditMode && existingRequest?.request_id && customer && company) {
      fetchExistingMedia(existingRequest.request_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, existingRequest?.request_id, customer, company]);

  const fetchExistingMedia = async (requestId) => {
    try {
      const response = await fetch(
        `${baseURL}/service-pools/${requestId}/media/?user_id=${customer}&company_id=${company}`
      );

      if (response.ok) {
        const result = await response.json();
        if (result.status === "success") {
          setExistingMedia(result.data || []);
        }
      } else {
        console.error("Failed to fetch existing media");
      }
    } catch (error) {
      console.error("Error fetching existing media:", error);
    }
  };

  // ------------ Handlers ------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Get service item name from ID
  const getServiceItemName = (serviceItemId) => {
    if (!serviceItemId) return "Not Selected";

    const itemFromApi = serviceItemsList.find(
      (item) => item.service_item_id === serviceItemId
    );
    if (itemFromApi) {
      return itemFromApi.service_item_name || serviceItemId;
    }

    const itemFromContext = serviceItems.find(
      (item) => item.service_item === serviceItemId
    );
    return itemFromContext
      ? itemFromContext.service_item_name || serviceItemId
      : serviceItemId;
  };

  // File selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    const validFiles = files.filter((file) => {
      const isValidType =
        file.type.startsWith("image/") || file.type.startsWith("video/");
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB

      if (!isValidType) {
        Swal.fire({
          icon: "warning",
          title: "Invalid File Type",
          text: `${file.name} is not a valid image or video file.`,
          confirmButtonColor: "#f8bb86",
        });
        return false;
      }

      if (!isValidSize) {
        Swal.fire({
          icon: "warning",
          title: "File Too Large",
          text: `${file.name} exceeds 50MB size limit.`,
          confirmButtonColor: "#f8bb86",
        });
        return false;
      }

      return true;
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    e.target.value = "";
  };

  // Remove file from local selected list
  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Open existing media in new tab
  const viewMedia = (media) => {
    const fullUrl = media.file.startsWith("http")
      ? media.file
      : `${baseURL}${media.file}`;
    window.open(fullUrl, "_blank");
  };

  // Upload media files
  const uploadMediaFiles = async (requestId, serviceItemId) => {
    if (selectedFiles.length === 0) return true;

    try {
      const formDataMedia = new FormData();
      formDataMedia.append("user_id", customer);
      formDataMedia.append("company_id", company);
      formDataMedia.append("service_item_id", serviceItemId);

      selectedFiles.forEach((file) => {
        formDataMedia.append("file", file);
      });

      const mediaUrl = `${baseURL}/service-pools/${requestId}/media/`;

      const response = await fetch(mediaUrl, {
        method: "POST",
        body: formDataMedia,
      });

      if (response.ok) {
        console.log("Media files uploaded successfully");
        return true;
      } else {
        const errorData = await response.json();
        console.error("Media upload failed:", errorData);
        throw new Error(errorData.message || "Media upload failed");
      }
    } catch (error) {
      console.error("Error uploading media files:", error);
      throw error;
    }
  };

  // Delete media file (multiple attempts, like customer)
  // SIMPLE delete method
const deleteMediaFile = async (mediaId) => {
  try {
    setDeletingMedia(prev => [...prev, mediaId]);

    const deleteUrl = `${baseURL}/service-pools/${existingRequest.request_id}/media/${mediaId}/`;

     const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: delegateId,
        company_id: company
      })
    });

    if (response.ok || response.status === 204) {
      // Remove from UI
      setExistingMedia(prev =>
        prev.filter(media => media.media_id !== mediaId)
      );

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Media file deleted successfully!",
      });

      return true;
    } else {
      throw new Error("Failed to delete media file");
    }
  } catch (error) {
    console.error("Delete Error:", error);
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Unable to delete the file. Please try again.",
    });
  } finally {
    setDeletingMedia(prev => prev.filter(id => id !== mediaId));
  }
};

  // Confirm delete
 const handleDeleteMedia = async (media) => {
  const result = await Swal.fire({
    title: "Delete File?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel"
  });

  if (result.isConfirmed) {
    await deleteMediaFile(media.media_id);
  }
};

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Extract filename from path
  const getFileNameFromPath = (filePath) => {
    return filePath.split("/").pop() || "File";
  };

  // ------------ Submit ------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!isEditMode && !selectedServiceItem) {
      await Swal.fire({
        icon: "warning",
        title: "Service Item Required",
        text: "Please select a Service Item from the navbar dropdown first.",
        confirmButtonColor: "#f8bb86",
      });
      setIsSubmitting(false);
      return;
    }

    const preferredTimeFormatted = `${formData.preferredTime}:00`;
    const now = new Date().toISOString();

    const payload = {
      dynamics_service_order_no: isEditMode
        ? existingRequest.dynamics_service_order_no
        : "",
      source_type: "Machine Alert",
      request_details: formData.description,
      alert_details: "",
      requested_by: delegateId,
      preferred_date: formData.preferredDate,
      preferred_time: preferredTimeFormatted,
      status: isEditMode ? existingRequest.status : "Open",
      estimated_completion_time: null,
      estimated_price: isEditMode ? existingRequest.estimated_price : "0",
      est_start_datetime: now,
      est_end_datetime: now,
      act_start_datetime: isEditMode ? existingRequest.act_start_datetime : now,
      act_end_datetime: isEditMode ? existingRequest.act_end_datetime : now,
      act_material_cost: isEditMode ? existingRequest.act_material_cost : "0",
      act_labour_hours: isEditMode ? existingRequest.act_labour_hours : "0",
      act_labour_cost: isEditMode ? existingRequest.act_labour_cost : "0",
      completion_notes: isEditMode ? existingRequest.completion_notes : "",
      created_by: isEditMode ? existingRequest.created_by : delegateId,
      updated_by: delegateId,
      company: company,
      service_item: isEditMode ? formData.serviceItem : selectedServiceItem,
      customer: customer,
      pm_group: isEditMode ? existingRequest.pm_group : "",
      assigned_engineer: isEditMode ? existingRequest.assigned_engineer : "",
      reopened_from: isEditMode ? existingRequest.reopened_from : "",
      user_id: customer,
      company_id: company,
      problem_type: formData.problemType || null,
    };

    if (isEditMode) {
      payload.request_id = existingRequest.request_id;
    } else {
      payload.request_id = Math.floor(Math.random() * 1000000).toString();
    }

    console.log("payload", payload);

    try {
      const url = isEditMode
        ? `${baseURL}/service-pools/${existingRequest.request_id}/`
        : `${baseURL}/service-pools/`;

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok) {
        // Get request ID for media upload
        const requestId =
          result.data?.request_id ||
          existingRequest?.request_id ||
          payload.request_id;
        const currentServiceItemId = isEditMode
          ? formData.serviceItem
          : selectedServiceItem;

        if (selectedFiles.length > 0 && requestId && currentServiceItemId) {
          try {
            await uploadMediaFiles(requestId, currentServiceItemId);
          } catch (mediaError) {
            console.warn(
              "Media upload failed but request was created/updated:",
              mediaError
            );
          }
        }

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: `Service request ${
            isEditMode ? "updated" : "submitted"
          } successfully!`,
          confirmButtonColor: "#3085d6",
        });

        if (!isEditMode) {
          setFormData({
            serviceItem: selectedServiceItem,
            preferredDate: "",
            preferredTime: "",
            description: "",
            problemType: "",
          });
          setSelectedFiles([]);
        }

        navigate("/delegate-display-request");
      } else {
        console.error("Failed response:", result);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: `Submission failed: ${
            result.message || "Please check the input."
          }`,
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while submitting the form.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/delegate-display-request");
  };

  const isFormDisabled = !isEditMode && !selectedServiceItem;

  return (
    <>
      <DelegateNavbar />
      <div className="container service-request-form">
        <div className="card requestformcard">
          <div className="card-header">
            <h5 className="mb-1">
              {isEditMode ? "Edit Service Request" : "Delegate Request Form"}
            </h5>
            <h6 className="text" style={{ color: "" }}>
              {isEditMode
                ? "Update the service request details"
                : "Please fill in the service request details"}
            </h6>
            {!isEditMode && !selectedServiceItem && (
              <p className="warning-text mt-2">
                ⚠️ Please select a Service Item from the navbar dropdown first.
              </p>
            )}
            {isEditMode && (
              <p className="info-text mt-2">
                📝 Editing Request ID:{" "}
                <strong>{existingRequest?.request_id}</strong>
              </p>
            )}
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* Service Item Display (readonly) */}
                <div className="col-md-6">
                  <label className="formlabel" style={{ marginLeft: "-155px" }}>
                    Service Item ID
                  </label>
                  <input
                    type="text"
                    id="serviceItemDisplay"
                    value={getServiceItemName(
                      isEditMode ? formData.serviceItem : selectedServiceItem
                    )}
                    disabled
                    className="form-control disabled-field"
                    placeholder={
                      isEditMode
                        ? "Service Item (cannot be changed)"
                        : "Select a service item from navbar"
                    }
                  />

                  {/* Hidden field to store the actual service_item value */}
                  <input
                    type="hidden"
                    name="serviceItem"
                    value={
                      isEditMode ? formData.serviceItem : selectedServiceItem
                    }
                  />
                </div>

                {/* Preferred Date */}
                <div className="col-md-6">
                  <label className="formlabel" style={{ marginLeft: "-85px" }}>
                    Preferred Service Date
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    id="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="form-control"
                    required
                    disabled={isFormDisabled}
                  />
                </div>

                {/* Preferred Time */}
                <div className="col-md-6">
                  <label className="formlabel" style={{ marginLeft: "-85px" }}>
                    Preferred Service Time
                  </label>
                  <input
                    type="time"
                    name="preferredTime"
                    id="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="form-control"
                    required
                    disabled={isFormDisabled}
                  />
                </div>

                {/* Problem Type */}
                <div className="col-md-6">
                  <label className="formlabel" style={{ marginLeft: "-145px" }}>
                    Problem Type
                  </label>
                  <select
                    name="problemType"
                    value={formData.problemType}
                    onChange={handleChange}
                    className="form-control"
                    disabled={isFormDisabled}
                  >
                    <option value="">
                      Select Problem Type (Optional)
                    </option>
                    {problemTypes.length === 0 ? (
                      <option value="" disabled>
                        Loading problem types...
                      </option>
                    ) : (
                      problemTypes.map((problemType) => (
                        <option
                          key={problemType.problem_type_id}
                          value={problemType.problem_type_id}
                        >
                          {problemType.name}
                        </option>
                      ))
                    )}
                  </select>
                  <small className="text-muted">
                    Select the type of problem you're experiencing
                  </small>
                </div>

                {/* Request Details */}
                <div className="col-12">
                  <label className="formlabel" style={{ marginLeft: "-137px" }}>
                    Request Details
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-control"
                    rows="4"
                    required
                    disabled={isFormDisabled}
                    placeholder={
                      isFormDisabled
                        ? "Please select a service item first"
                        : "Enter request details"
                    }
                  />
                </div>

                {/* File Upload Section */}
                <div className="col-12">
                  <label className="formlabel" style={{ marginLeft: "7px" }}>
                    {isEditMode
                      ? "Manage Images & Videos"
                      : "Upload Images & Videos (Optional)"}
                  </label>
                  <div className="file-upload-section">
                    <div className="file-upload-area">
                      <input
                        type="file"
                        id="file-upload"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="file-input"
                        disabled={isFormDisabled}
                      />
                      <label
                        htmlFor="file-upload"
                        className={`file-upload-label ${
                          isFormDisabled ? "disabled" : ""
                        }`}
                      >
                        <FaUpload className="me-2" />
                        {isEditMode ? "Add More Files" : "Choose Images & Videos"}
                      </label>
                      <small className="text-muted d-block mt-2">
                        Supported formats: JPG, PNG, GIF, MP4, AVI, MOV. Max file
                        size: 50MB
                      </small>
                    </div>

                    {/* Existing Media Files (Edit Mode Only) */}
                    {isEditMode && existingMedia.length > 0 && (
                      <div className="existing-media mt-4">
                        <h6>
                          Existing Media Files ({existingMedia.length}):
                        </h6>
                        <div className="file-list">
                          {existingMedia.map((media) => (
                            <div
                              key={media.media_id}
                              className="file-item existing-file"
                            >
                              <div className="file-info">
                                {media.media_type === "Image" ? (
                                  <FaImage className="file-icon text-success" />
                                ) : (
                                  <FaVideo className="file-icon text-warning" />
                                )}
                                <div className="file-details">
                                  <span className="file-name">
                                    {getFileNameFromPath(media.file)}
                                  </span>
                                  <span className="file-type">
                                    {media.media_type}
                                  </span>
                                  <span className="file-date">
                                    Uploaded:{" "}
                                    {new Date(
                                      media.uploaded_at
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="file-actions">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => viewMedia(media)}
                                  title="View File"
                                  disabled={deletingMedia.includes(
                                    media.media_id
                                  )}
                                >
                                  <FaEye />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteMedia(media)}
                                  title="Delete File"
                                  disabled={deletingMedia.includes(
                                    media.media_id
                                  )}
                                >
                                  {deletingMedia.includes(media.media_id) ? (
                                    <div
                                      className="spinner-border spinner-border-sm"
                                      role="status"
                                    >
                                      <span className="visually-hidden">
                                        Deleting...
                                      </span>
                                    </div>
                                  ) : (
                                    <FaTrash />
                                  )}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Selected Files */}
                    {selectedFiles.length > 0 && (
                      <div className="selected-files mt-3">
                        <h6>New Files to Upload ({selectedFiles.length}):</h6>
                        <div className="file-list">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="file-item">
                              <div className="file-info">
                                {file.type.startsWith("image/") ? (
                                  <FaImage className="file-icon text-primary" />
                                ) : (
                                  <FaVideo className="file-icon text-danger" />
                                )}
                                <div className="file-details">
                                  <span className="file-name">{file.name}</span>
                                  <span className="file-size">
                                    {formatFileSize(file.size)}
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeFile(index)}
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-center mt-3 gap-3">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isFormDisabled || isSubmitting}
                  >
                    {isSubmitting
                      ? isEditMode
                        ? "Updating..."
                        : "Submitting..."
                      : isEditMode
                      ? "Update Request"
                      : "Submit Request"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default DelegateRequestForm;