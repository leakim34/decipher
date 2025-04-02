<script context="module" lang="ts">
  // Process step messages with different themes
  type MessageSet = {
    theme: string;
    messages: string[];
  };
  
  const processSets: MessageSet[] = [
    {
      theme: "Metaphorical Journey",
      messages: [
        "Spelunking into the blockchain caves...",
        "Untangling the base64 spaghetti...",
        "Translating ancient TEAL hieroglyphics...",
        "Teaching AI to speak human about what it found..."
      ]
    },
    {
      theme: "Detective Theme",
      messages: [
        "Detective work: Tracking down your contract on the blockchain...",
        "Decoding the secret base64 message...",
        "Interrogating the TEAL code for answers...",
        "Consulting with AI to solve the final puzzle..."
      ]
    },
    {
      theme: "Kitchen/Cooking Theme",
      messages: [
        "Hunting for fresh ingredients on the blockchain...",
        "Unwrapping the base64 packaging...",
        "Prepping the raw TEAL for cooking...",
        "Chef AI preparing your simplified explanation..."
      ]
    },
    {
      theme: "Space/Alien Theme",
      messages: [
        "Launching search probes into the blockchain universe...",
        "Decrypting alien base64 transmissions...",
        "Translating TEAL to Earth languages...",
        "AI ambassador preparing human-friendly message..."
      ]
    },
    {
      theme: "Translation Theme",
      messages: [
        "Finding the contract in blockchain-ese...",
        "Converting from base64 to something less robotic...",
        "Decompiling TEAL into almost-human language...",
        "AI finishing the translation to plain English..."
      ]
    },
    {
      theme: "Magic Theme",
      messages: [
        "Summoning your contract from the blockchain realm...",
        "Casting 'Decode Base64' spell...",
        "Transforming cryptic TEAL into readable form...",
        "AI wizard conjuring the final human-friendly explanation..."
      ]
    }
  ];
  
  let currentMessageSet: MessageSet | null = null;
  let currentStepIndex = 0;
  let progressInterval: number | undefined = undefined;
  
  export function startAnimation() {
    // Select a random message set
    const randomIndex = Math.floor(Math.random() * processSets.length);
    currentMessageSet = processSets[randomIndex];
    currentStepIndex = 0;
    
    // Clear any existing interval
    if (progressInterval) clearInterval(progressInterval);
    
    // Define the step durations (first 3 steps longer, last step shorter)
    const stepDurations = [4000, 3500, 3000, 2500]; // ms for each step
    
    // Start the progression through steps
    let nextStepTime = stepDurations[0];
    progressInterval = setInterval(() => {
      if (currentStepIndex < currentMessageSet!.messages.length - 1) {
        currentStepIndex++;
        
        // If we've reached the last step or beyond, clear the interval
        if (currentStepIndex >= currentMessageSet!.messages.length - 1) {
          if (progressInterval) clearInterval(progressInterval);
        } else {
          // Otherwise, adjust the interval for the next step
          if (progressInterval) clearInterval(progressInterval);
          nextStepTime = stepDurations[currentStepIndex];
          progressInterval = setInterval(() => {
            if (currentStepIndex < currentMessageSet!.messages.length - 1) {
              currentStepIndex++;
              
              // If we've reached the last step, clear the interval
              if (currentStepIndex >= currentMessageSet!.messages.length - 1) {
                if (progressInterval) clearInterval(progressInterval);
              }
            }
          }, nextStepTime);
        }
      }
    }, nextStepTime);
  }
  
  export function stopAnimation() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = undefined;
    }
    currentMessageSet = null;
    currentStepIndex = 0;
  }
</script>

<script lang="ts">
  let _currentMessageSet = $state<MessageSet | null>(currentMessageSet);
  let _currentStepIndex = $state(currentStepIndex);
  
  // Update local state when module state changes
  $effect(() => {
    _currentMessageSet = currentMessageSet;
    _currentStepIndex = currentStepIndex;
  });
  
  let currentMessage = $derived(
    _currentMessageSet?.messages[_currentStepIndex] || "Analyzing..."
  );
</script>

<span class="transition-all duration-500 ease-in-out">{currentMessage}</span> 