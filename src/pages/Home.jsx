import ContributionForm from "../components/ContributionForm";


function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dfe6e9] via-[#dfe6e9] to-[#dfe6e9] flex flex-col items-center justify-center p-6 text-white">
      <div className="bg-[#27548A] bg-opacity-20 backdrop-filter backdrop-blur-xl shadow-2xl rounded-3xl p-10 md:p-16 max-w-2xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-100 mb-8">
          Welcome to Dusangire Lunch
        </h1>
        <p className="text-lg text-gray-300 leading-relaxed mb-6">
          Dusangire Lunch is a school feeding initiative launched by the Ministry of Education in
          collaboration with Mobile Money Rwanda Ltd and Umwalimu SACCO. The goal is to help students
          across Rwanda get access to nutritious meals at school.
        </p>
        <p className="text-lg text-gray-300 leading-relaxed mb-10">
          You can support this initiative by contributing through Mobile Money or Bank transfers. Every
          contribution helps improve student education and wellbeing.
        </p>
        <ContributionForm />
      </div>
    </div>
  );
}

export default Home;