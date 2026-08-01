import { useState, useEffect } from "react";
import { 
  createCompany, 
  searchCompanies, 
  createRecruiterProfile,
  updateRecruiterProfile, 
  getRecruiterProfile 
} from "@/lib/api";

export function useRecruiterSetup(router) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [companySearch, setCompanySearch] = useState("");
  const [companyResults, setCompanyResults] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [creatingCompany, setCreatingCompany] = useState(true);
  
  const [newCompany, setNewCompany] = useState({
    name: "", description: "", industry: "", location: "", websiteUrl: "", logoUrl: "",
    type: "", size: "", yearEstablished: "", corporateEmail: "", phone: "",
    linkedinUrl: "", twitterUrl: "", taxId: "", perks: []
  });
  const [form, setForm] = useState({
    fullName: "", phone: "", designation: "", companyId: null
  });

  useEffect(() => {
    async function loadData() {
      try {
        const existing = await getRecruiterProfile();
        setForm({
          fullName: existing.fullName || "",
          phone: existing.phone || "",
          designation: existing.designation || "",
          companyId: existing.company?.id || null,
        });
        if (existing.company) {
          setSelectedCompany(existing.company);
          setCompanySearch(existing.company.name);
        }
      } catch {
        // Normal behavior if no profile yet
      }
    }
    loadData();
  }, []);

  const handleCompanySearch = async (val) => {
    setCompanySearch(val);
    if (val.length < 2) return setCompanyResults([]);
    try {
      const results = await searchCompanies(val);
      setCompanyResults(results);
    } catch { 
      setCompanyResults([]); 
    }
  };

  const selectCompany = (company) => {
    setSelectedCompany(company);
    setForm(f => ({ ...f, companyId: company.id }));
    setCompanyResults([]);
    setCompanySearch(company.name);
    setCreatingCompany(false);
  };

  const [successMessage, setSuccessMessage] = useState("");

  const handleCreateCompany = async () => {
    if (!newCompany.name) return setError("Company name is required.");
    try {
      const created = await createCompany(newCompany);
      selectCompany(created);
      setSuccessMessage("Company submitted successfully! It is currently pending admin verification.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async () => {
    if (!form.companyId) return setError("Please select or create a company to proceed.");
    if (!form.fullName) return setError("Your full name is required.");
    
    setLoading(true);
    setError(null);
    try {
      let profileExists = false;
      try {
        await getRecruiterProfile();
        profileExists = true;
      } catch (err) {
        // Only treat 404 as "profile doesn't exist yet"
        if (err.status !== 404) throw err;
      }

      if (profileExists) {
        await updateRecruiterProfile(form);
      } else {
        await createRecruiterProfile(form);
      }
      router.push("/dashboard/recruiter");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    companySearch,
    setCompanySearch,
    companyResults,
    selectedCompany,
    setSelectedCompany,
    creatingCompany,
    setCreatingCompany,
    newCompany,
    setNewCompany,
    form,
    setForm,
    handleCompanySearch,
    selectCompany,
    handleCreateCompany,
    handleSubmit
  };
}
