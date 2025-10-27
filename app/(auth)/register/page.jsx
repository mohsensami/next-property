import Providers from "../Providers";
import RegisterForm from "../RegisterForm";

const RegisterPage = () => {
  // useEffect(() => {
  //   const setAuthProviders = async () => {
  //     const res = await getProviders();
  //     setProviders(res);
  //   };

  //   setAuthProviders();

  //   // NOTE: close mobile menu if the viewport size is changed
  //   window.addEventListener("resize", () => {
  //     setIsMobileMenuOpen(false);
  //   });
  // }, []);
  return (
    <div>
      <div className="bg-gray-100 flex h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-white shadow-md rounded-md p-6">

            <h2 className="my-3 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign up for an account
            </h2>

            <div>
              <RegisterForm />
            </div>
            <div>
              <Providers />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
