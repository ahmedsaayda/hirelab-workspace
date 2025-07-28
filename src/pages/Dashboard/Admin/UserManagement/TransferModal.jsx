import React, { useState, useEffect, useCallback } from "react";
import { Modal, Select, Button, message, Checkbox, Input } from "antd";
import debounce from "lodash/debounce";
import CrudService from "../../../../services/CrudService";
import ATSService from "../../../../services/ATSService";

const TransferModal = ({
  visible,
  onClose,
  user, // This is the target user TO transfer pages to
  onTransferSuccess,
}) => {
  const [landingPages, setLandingPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLandingPages = async (searchText = "") => {
    setLoading(true);
    try {
      const data = {
        // Remove user filter to get ALL landing pages
        sort: { createdAt: -1 },
        populate: "user_id", // Populate user info to show current owner
      };
      if (searchText) {
        data.text = searchText;
      }
      
      const response = await CrudService.search(
        "LandingPageData",
        100,
        1,
        data
      );
      // Filter out pages that already belong to the target user
      const allPages = response.data.items || [];
      const filteredPages = allPages.filter(page => page.user_id !== user._id && page.user_id?._id !== user._id);
      setLandingPages(filteredPages);
    } catch (error) {
      console.error("Error fetching landing pages:", error);
      message.error("Failed to fetch landing pages");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchLandingPages = useCallback(
    debounce(fetchLandingPages, 500),
    [user]
  );

  useEffect(() => {
    if (visible && user) {
      debouncedFetchLandingPages(searchTerm);
    }
  }, [visible, searchTerm, user]);

  const handleTransfer = async () => {
    if (selectedPages.length === 0) {
      message.error("Please select at least one landing page to transfer.");
      return;
    }
    if (!user) { // Changed from selectedUser to user
      message.error("Please select a user to transfer the pages to.");
      return;
    }

    setLoading(true);
    try {
      for (const landingPageId of selectedPages) {
        await ATSService.transferLandingPage(landingPageId, user._id);
      }
      message.success("Landing pages transferred successfully");
      onTransferSuccess();
      onClose();
    } catch (error) {
        console.log(error);
      message.error("Failed to transfer landing pages");
    } finally {
      setLoading(false);
    }
  };

  const allPageIds = landingPages.map((p) => p._id);
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPages(allPageIds);
    } else {
      setSelectedPages([]);
    }
  };

  return (
    <Modal
      title={`Transfer Landing Pages TO ${user.email}`}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleTransfer}
        >
          Transfer to {user.email}
        </Button>,
      ]}
    >
      <div>
        <div style={{ marginBottom: 15, padding: 10, backgroundColor: "#f6f8fa", borderRadius: 5 }}>
          <strong>Note:</strong> You are transferring landing pages TO <strong>{user.email}</strong>. 
          Only pages from other users are shown below.
        </div>
        
        <h4>Select Landing Pages to Transfer:</h4>
        <Input
          placeholder="Search by name or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 10 }}
          loading={loading}
        />
        {!loading && landingPages.length > 0 && (
          <>
            <Checkbox
              indeterminate={
                selectedPages.length > 0 && selectedPages.length < allPageIds.length
              }
              onChange={handleSelectAll}
              checked={
                selectedPages.length === allPageIds.length && allPageIds.length > 0
              }
            >
              Select All ({landingPages.length} pages)
            </Checkbox>
            <hr style={{ margin: "10px 0" }} />
          </>
        )}
        
        {loading && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            Loading landing pages...
          </div>
        )}
        
        {!loading && landingPages.length === 0 && (
          <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
            {searchTerm 
              ? `No landing pages found matching "${searchTerm}"` 
              : `No transferable landing pages available`
            }
          </div>
        )}
        
        {!loading && landingPages.length > 0 && (
          <Checkbox.Group
            style={{ width: "100%", maxHeight: "200px", overflowY: "auto" }}
            value={selectedPages}
            onChange={(checkedValues) => setSelectedPages(checkedValues)}
          >
            {landingPages.map((page) => (
              <div key={page._id} style={{ padding: "5px 0", borderBottom: "1px solid #f0f0f0" }}>
                <Checkbox value={page._id}>
                  <div>
                    <div style={{ fontWeight: "bold" }}>
                      {page.vacancyTitle || page.title || page.name || "Untitled Page"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      ID: {page._id}
                    </div>
                    <div style={{ fontSize: "12px", color: "#007bff", marginTop: "2px" }}>
                      Current owner: {page.user_id?.email || page.user_id || "Unknown"}
                    </div>
                    {page.description && (
                      <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
                        {page.description.length > 50 
                          ? `${page.description.substring(0, 50)}...` 
                          : page.description
                        }
                      </div>
                    )}
                  </div>
                </Checkbox>
              </div>
            ))}
          </Checkbox.Group>
        )}
      </div>
    </Modal>
  );
};

export default TransferModal; 