import PrimaryButtonAnchorTag from "../buttons/anchortag/PrimaryButtonAnchorTag";

const SubscriptionCard = () => {
  const plans = [
    {
      name: "Guld",
      price: 139,
      description: "God og effektiv",
      popular: false,
    },
    {
      name: "Premium",
      price: 169,
      description: "Ekstra grundig",
      popular: true,
    },
    {
      name: "Brilliant",
      price: 199,
      description: "Bedste vask året rundt",
      popular: false,
    },
  ];

  return (
    <section className="max-w-lg w-full flex gap-4 overflow-x-auto scroll-smooth hide-scrollbar pt-8 pb-8">
      {plans.map((plan) => (
        <article key={plan.name} className={`bg-(--gray-60) w-52 h-52 rounded-md flex flex-col items-center justify-center shrink-0 ${plan.popular ? "relative" : ""}`}>
          {plan.popular && <div className="absolute -top-6 right-1 bg-(--splash) px-2 py-1 z-10">Populær!</div>}
          <p className="extra-bold mt-2">{plan.name}</p>
          <div className="flex items-center gap-2">
            <h1 className="extra-bold">{plan.price}</h1>
            <p>kr./md.</p>
          </div>
          <p className="pb-2">{plan.description}</p>
          <PrimaryButtonAnchorTag href="/">Læs mere</PrimaryButtonAnchorTag>
        </article>
      ))}
    </section>
  );
};

export default SubscriptionCard;
