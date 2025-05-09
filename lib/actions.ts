"use server"

import { createClient } from "@/utils/supabase/server"

export async function getCurrentUser() {
  const supabase = createClient()
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    return user
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

export async function getUserOrders(userId: string) {
  const supabase = createClient()
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error getting orders:", error)
      return []
    }

    return data
  } catch (error) {
    console.error("Error getting orders:", error)
    return []
  }
}

export async function createOrder(order: {
  productType: string
  inputData: any
  shipping_address?: any
  phone_number?: string | null
}) {
  // Check if we're in preview mode
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log("Preview mode detected in createOrder, returning mock ID")
    return `preview-${order.productType}-${Date.now()}`
  }

  const supabase = createClient()
  const user = await getCurrentUser()

  // Log the user object we received
  console.log("User object retrieved in createOrder:", user);

  // In preview mode or if no user is found, return a mock ID
  if (!user) {
    console.log("No user found, returning mock order ID")
    return `preview-${order.productType}-${Date.now()}`
  }

  console.log(`Creating order for user ${user.id}, product: ${order.productType}`);
  console.log("Order input data:", JSON.stringify(order.inputData, null, 2));
  console.log("Shipping Address:", JSON.stringify(order.shipping_address, null, 2));
  console.log("Phone Number:", order.phone_number);

  try {
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id: user.id,
          product_type: order.productType,
          input_data: order.inputData,
          shipping_address: order.shipping_address,
          phone_number: order.phone_number,
          status: "processing",
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating order:", error)
      throw error
    }

    return data.id
  } catch (error) {
    console.error("Error creating order:", error)
    // In case of error, return a mock ID to allow the flow to continue
    return `preview-${order.productType}-${Date.now()}`
  }
}

export async function getOrderById(orderId: string) {
  // If the ID contains "preview", return mock data
  if (orderId.includes("preview")) {
    const productType = orderId.includes("song")
      ? "song"
      : orderId.includes("portrait")
        ? "portrait"
        : orderId.includes("poetry")
          ? "poetry"
          : "book"

    return {
      id: orderId,
      user_id: "preview-user",
      product_type: productType,
      status: "processing",
      created_at: new Date().toISOString(),
      input_data: {
        // Mock data based on product type
        recipientName: "Sarah",
        funFacts: "Loves hiking and jazz music",
        occasion: "birthday",
        style: "watercolor",
        photoUrl: "/placeholder.svg?height=300&width=300",
        subject: "Nature",
        details: "A poem about the changing seasons",
        tone: "reflective",
        title: "Adventure in the Forest",
        premise: "A story about friendship and discovery",
      },
    }
  }

  const supabase = createClient()
  try {
    const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).single()

    if (error) {
      console.error("Error getting order:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error getting order:", error)
    return null
  }
}

// Add the missing uploadFile function
export async function uploadFile(file: File) {
  console.log(`uploadFile action started. File name: ${file.name}, Size: ${file.size}`); // Log start

  // Check if we're in preview mode
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log("Preview mode detected in uploadFile, returning placeholder");
    // In preview mode, return a placeholder with the filename to make it more realistic
    const fileName = encodeURIComponent(file.name);
    return `/placeholder.svg?height=300&width=300&text=${fileName}`;
  }

  const supabase = createClient();
  console.log("Supabase client created for upload."); // Log client creation

  // Generate a unique file name
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  const fileExt = file.name.split(".").pop();
  const filePath = `${fileName}.${fileExt}`;
  console.log(`Generated file path: ${filePath}`); // Log file path

  try {
    console.log(`Attempting upload to user-uploads bucket...`); // Log upload attempt
    // First try the use-uploads bucket
    let { data, error } = await supabase.storage.from("user-uploads").upload(filePath, file);

    // Log the result of the first attempt
    if (error) {
        console.error("Error uploading to user-uploads:", error);
    } else {
        console.log("Successfully uploaded to user-uploads:", data);
    }


    // If bucket not found, try the public bucket
    if (error && error.message.includes("Bucket not found")) {
      console.log("user-uploads bucket not found, trying public bucket");
      const result = await supabase.storage.from("public").upload(filePath, file);
      data = result.data;
      error = result.error; // Update error with the result of this attempt

      // Log result of public bucket attempt
      if (error) {
          console.error("Error uploading to public bucket:", error);
      } else {
          console.log("Successfully uploaded to public bucket:", data);
      }

      // If public bucket also fails, try a fallback bucket
      if (error && error.message.includes("Bucket not found")) {
        console.log("public bucket not found, trying fallback bucket");
        const fallbackResult = await supabase.storage.from("avatars").upload(filePath, file);
        data = fallbackResult.data;
        error = fallbackResult.error; // Update error with the result of this attempt

         // Log result of avatars bucket attempt
        if (error) {
            console.error("Error uploading to avatars bucket:", error);
        } else {
            console.log("Successfully uploaded to avatars bucket:", data);
        }
      }
    }

    // If all storage attempts fail, return a placeholder
    // This check should now happen *after* all attempts
    if (error) {
      // Log the final error state before returning placeholder
      console.error("Final upload error after all attempts:", error);
      const errorFileName = encodeURIComponent(file.name);
      return `/placeholder.svg?height=300&width=300&text=${errorFileName}`;
    }

    // Get the public URL from the successful bucket
    let publicUrl;
    if (data?.path) {
       console.log(`Determining public URL for path: ${data.path}`); // Log path used for URL
      // --- Simplified bucket determination for logging ---
      let bucketName = "user-uploads"; // Default assumption
      if (data.path.includes("public/")) {
          bucketName = "public";
      } else if (data.path.includes("avatars/")) {
          bucketName = "avatars";
      }
       console.log(`Using bucket name: ${bucketName} for getPublicUrl`); // Log bucket name

      const { data: urlData, error: urlError } = supabase.storage.from(bucketName).getPublicUrl(data.path);

      if (urlError) {
          console.error(`Error getting public URL from ${bucketName}:`, urlError);
          // Handle URL error - maybe return placeholder?
           const errorFileName = encodeURIComponent(file.name);
           return `/placeholder.svg?height=300&width=300&text=${errorFileName}`;
      }

      publicUrl = urlData.publicUrl;
       console.log(`Successfully got public URL: ${publicUrl}`); // Log success
    } else {
       console.error("Upload succeeded but data.path is missing. Cannot get public URL.", data); // Log missing path issue
      // Fallback if we can't determine the bucket or path is missing
      const { data: urlData, error: urlError } = supabase.storage.from("user-uploads").getPublicUrl(filePath);
       if (urlError) {
           console.error("Error getting public URL from fallback 'user-uploads':", urlError);
           const errorFileName = encodeURIComponent(file.name);
           return `/placeholder.svg?height=300&width=300&text=${errorFileName}`;
       }
      publicUrl = urlData.publicUrl;
      console.log(`Successfully got public URL from fallback: ${publicUrl}`);
    }

    return publicUrl;
  } catch (error) {
    // This top-level catch might indicate an error *before* the storage call
    console.error("Critical error in uploadFile try block:", error);
    // Return a placeholder in case of any unexpected error
    const errorFileName = encodeURIComponent(file.name);
    return `/placeholder.svg?height=300&width=300&text=${errorFileName}`;
  }
}
