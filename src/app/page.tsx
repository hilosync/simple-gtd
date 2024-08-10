import HomePage from "~/components/HomePage";
import GTDPage from "~/components/GTDPage";
import { dark } from "@clerk/themes";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";

const page: React.FC = () => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        signIn: { baseTheme: dark },
      }}
    >
      <SignedOut>
        <HomePage></HomePage>
      </SignedOut>
      <SignedIn>
        <GTDPage></GTDPage>
      </SignedIn>
    </ClerkProvider>
  );
};

export default page;
