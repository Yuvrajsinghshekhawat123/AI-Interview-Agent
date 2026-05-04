 // components/CreditPackages.jsx - Updated with purchase tracking
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { MdCheckCircle, MdError, MdRefresh, MdVerified } from "react-icons/md";
import { useGetPackages } from "../../../03-features/01-user/03-hook/payment/01-useGetPackages";
import { useBalance } from "../../../03-features/01-user/03-hook/payment/04-useBalance";
import { useCreateOrder } from "../../../03-features/01-user/03-hook/payment/02-useCreateOrder";
import { useVerifyPayment } from "../../../03-features/01-user/03-hook/payment/03-useVerifyPayment";
import { useGetPurchasedPackages } from "../../../03-features/01-user/03-hook/payment/06-useGetPurchasedPackages";

export const CreditPackages = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [creditBalance, setCreditBalance] = useState(0);
  const [totalPurchased, setTotalPurchased] = useState(0);
  const [processingPackageId, setIsProcessingPackageId] = useState(null);
  const [purchasedPackageIds, setPurchasedPackageIds] = useState([]);

  // Fetch packages and balance using React Query hooks
  const { 
    data: packagesData, 
    isLoading: isPackagesLoading, 
    error: packagesError, 
    refetch: refetchPackages,
    isFetching: isFetchingPackages 
  } = useGetPackages();
  
  const { 
    data: balanceData, 
    isLoading: isBalanceLoading, 
    error: balanceError, 
    refetch: refetchBalance,
    isFetching: isFetchingBalance
  } = useBalance();

  const {
    data: purchasedData,
    refetch: refetchPurchased,
  } = useGetPurchasedPackages();

  // Extract data from response
  const packages = packagesData?.packages || [];
  const balance = balanceData?.credits || 0;
  const purchasedPackages = purchasedData?.purchasedPackages || [];

  // Load Razorpay script dynamically
  useEffect(() => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      return;
    }
    
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Update credit balance when balance data changes
  useEffect(() => {
    if (balanceData?.credits !== undefined) {
      setCreditBalance(balanceData.credits);
    }
    if (balanceData?.totalPurchased !== undefined) {
      setTotalPurchased(balanceData.totalPurchased);
    }
  }, [balanceData]);

  // Update purchased packages IDs
  useEffect(() => {
    if (purchasedPackages.length > 0) {
      const ids = purchasedPackages.map(p => p.packageId?._id || p.packageId);
      setPurchasedPackageIds(ids);
    }
  }, [purchasedPackages]);

  const fetchCreditBalance = async () => {
    try {
      const result = await refetchBalance();
      if (result.data?.credits !== undefined) {
        setCreditBalance(result.data.credits);
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  const { mutate: createOrder } = useCreateOrder();
  const { mutate: verifyPayment } = useVerifyPayment();

  const handlePurchase = (pkg) => {
    // Check if already purchased (for free package)
    if (pkg.isFree || pkg.price === 0) {
      if (purchasedPackageIds.includes(pkg._id)) {
        toast.info("You have already claimed the free package!");
        return;
      }
    }

    if (processingPackageId === pkg._id) return;

    // 🟢 Free Package
    if (pkg.isFree || pkg.price === 0) {
      setIsProcessingPackageId(pkg._id);

      createOrder(
        { packageId: pkg._id },
        {
          onSuccess: async (data) => {
            if (data.success) {
              toast.success(`✨ ${pkg.credits} credits added to your account!`);
              await fetchCreditBalance();
              await refetchPackages();
              await refetchPurchased();
            } else {
              toast.error(data.message || "Failed to activate free package");
            }
            setIsProcessingPackageId(null);
          },
          onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to activate free package");
            setIsProcessingPackageId(null);
          },
        }
      );
      return;
    }

    // 🔵 Paid Package
    setIsProcessingPackageId(pkg._id);

    createOrder(
      { packageId: pkg._id },
      {
        onSuccess: (data) => {
          if (!data.success) {
            toast.error(data.message || "Failed to create order");
            setIsProcessingPackageId(null);
            return;
          }

          const options = {
            key: data.keyId,
            amount: data.amount,
            currency: data.currency,
            name: "AI Interview Platform",
            description: `Purchase ${pkg.credits} credits - ${pkg.name}`,
            order_id: data.orderId,
            handler: (response) => {
              verifyPayment(
                {
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  paymentRecordId: data.paymentId,
                },
                {
                  onSuccess: async (res) => {
                    if (res.success) {
                      toast.success(`✅ Successfully purchased ${pkg.credits} credits!`);
                      await fetchCreditBalance();
                      await refetchPackages();
                      await refetchPurchased();
                      setSelectedPackage(null);
                    } else {
                      toast.error(res.message || "Payment verification failed");
                    }
                    setIsProcessingPackageId(null);
                  },
                  onError: (error) => {
                    toast.error(error?.response?.data?.message || "Payment verification failed");
                    setIsProcessingPackageId(null);
                  },
                }
              );
            },
            prefill: {
              name: "User Name",
              email: "user@example.com",
            },
            theme: { color: "#00D4FF" },
            modal: {
              ondismiss: () => {
                setIsProcessingPackageId(null);
                toast.info("Payment cancelled");
              },
            },
          };

          const razorpay = new window.Razorpay(options);
          razorpay.open();
        },
        onError: (error) => {
          console.error("Payment error:", error);
          toast.error(error?.response?.data?.message || "Failed to create order");
          setIsProcessingPackageId(null);
        },
      }
    );
  };

  const isLoading = isPackagesLoading || isBalanceLoading;
  const error = packagesError || balanceError;

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0F1E] via-[#0F1629] to-[#0A0F1E] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[#00D4FF]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[#00FFB3] border-r-[#00D4FF] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Loading Credit Packages</h2>
            <p className="text-gray-400">Fetching available plans...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0F1E] via-[#0F1629] to-[#0A0F1E] flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl p-8 border border-red-500/30">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdError className="text-red-500 text-3xl" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Failed to Load Packages</h3>
          <p className="text-gray-400 mb-6">{error.message || "An error occurred"}</p>
          <button
            onClick={() => {
              refetchPackages();
              refetchBalance();
              refetchPurchased();
            }}
            className="px-6 py-2 bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] rounded-lg font-semibold text-[#0A0F1E] hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
          >
            <MdRefresh className={isFetchingPackages || isFetchingBalance ? "animate-spin" : ""} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1E] via-[#0F1629] to-[#0A0F1E] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#00D4FF] via-[#00FFB3] to-[#00D4FF] bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-[#00D4FF]/60 text-lg">
            Credits accumulate - buy multiple packages to get more!
          </p>
        </motion.div>

        {/* Credit Balance Card - Enhanced */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="max-w-md mx-auto mb-12"
        >
          <div className="bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#00D4FF]/20 text-center">
            <p className="text-gray-400 text-sm mb-2">Your Credit Balance</p>
            <p className="text-5xl font-bold text-[#00FFB3] mb-2">{creditBalance}</p>
            <p className="text-xs text-gray-500">available credits</p>
            {totalPurchased > 0 && (
              <p className="text-xs text-[#00D4FF] mt-2">
                {totalPurchased} credits purchased total
              </p>
            )}
            {purchasedPackages.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700/50">
                <p className="text-xs text-gray-500">Packages purchased:</p>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {purchasedPackages.map((pkg, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-[#00FFB3]/10 rounded-full text-[#00FFB3]">
                      {pkg.packageId?.name || pkg.packageName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg, index) => {
            const isPurchased = purchasedPackageIds.includes(pkg._id) && creditBalance > 50;
            
            return (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 ${
                  isPurchased ? 'opacity-75' : 'hover:scale-105'
                } ${
                  pkg.popular 
                    ? "border-[#00FFB3] shadow-[0_0_20px_rgba(0,255,179,0.2)]" 
                    : "border-[#00D4FF]/20 hover:border-[#00D4FF]/50"
                }`}
              >
                {/* Purchased Badge */}
                {isPurchased && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <MdVerified size={12} /> Purchased
                    </span>
                  </div>
                )}

                {pkg.popular && !isPurchased && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] text-[#0A0F1E] text-xs font-bold px-3 py-1 rounded-full">
                      BEST VALUE
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-[#00FFB3]">{pkg.credits}</div>
                  <p className="text-xs text-gray-500 mb-3">interview credits</p>
                  {pkg.price === 0 ? (
                    <div className="text-2xl font-bold text-white">Free</div>
                  ) : (
                    <div>
                      <span className="text-3xl font-bold text-white">₹{pkg.price}</span>
                      <span className="text-xs text-gray-500 ml-1">one-time</span>
                      {pkg.savings && <div className="text-xs text-[#00FFB3] mt-1">{pkg.savings}</div>}
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {pkg.features?.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                      <MdCheckCircle className="text-[#00FFB3] text-sm flex-shrink-0" />
                      <span>{typeof feature === 'string' ? feature : feature.name}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(pkg)}
                  disabled={  (pkg.isFree || isPurchased)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    isPurchased && pkg.isFree
                      ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                      : isPurchased
                      ? "bg-green-500/20 text-green-500 cursor-default"
                      : pkg.price === 0
                      ? "bg-[#00D4FF]/20 text-[#00D4FF] hover:bg-[#00D4FF]/30"
                      : "bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] text-[#0A0F1E] hover:shadow-lg"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isPurchased && pkg.isFree
                    ? "Already Claimed"
                    : isPurchased
                    ? "Already Purchased"
                    : processingPackageId === pkg._id
                    ? "Processing..."
                    : pkg.price === 0
                    ? "Claim Free Package"
                    : "Buy Now"}
                </button>
                
                {isPurchased && !pkg.isFree && (
                  <p className="text-center text-xs text-green-500/70 mt-2">
                    ✓ Credits added to your balance
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        .animation-delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
};