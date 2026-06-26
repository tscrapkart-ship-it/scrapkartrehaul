Hey everyone, as I mentioned earlier, here are the new flows for how our B2B platform will work. It's a bit long, but please do give it a read.

*THE PROBLEM*

Right now on b2b.scrapkart.app, the moment a buyer and seller connect, they can see each other's company name and email, and they can message each other freely. So a phone number gets exchanged, the deal happens, and the next time they just call each other directly. We did the hard work of matching them and then we get cut out. We basically become a directory they used once and never came back to.

for instance, we want it to work more like Upwork, where the client and the worker both have to stay on the platform to actually get the work done.

*ONE THING WE HAVE TO BE HONEST ABOUT*

Scrap is physical. A truck has to go to the seller's location to pick up the material, so the buyer and seller will end up meeting in person at pickup. We can't hide who they are forever.

So hiding names and removing the chat is useful, but only to protect the FIRST deal and push it through us. The real way to keep them coming back is money. If the payment and the official record of the deal go through ScrapKart (and we take a small commission), then going around us means losing protection and breaking our terms. That money piece is what actually makes a platform sticky, not the hiding.

*SEPARATE INPUTS WE STILL NEED TO BUILD*

Recently Muzammil got inputs (from a recycler they met), and these were the inputs:

- When you go to browse the marketplace, we create a new page / option for the type of service: recycling, refurbishing, or reselling. Because a refurbisher will quote way higher than a recycler.
- The seller, while posting, should have an option to choose what service he requires.
- The buyers (recyclers), while browsing, should have that as a filter. For example, the recycler they met is not into refurbishing, so he should be able to quote only for the items that are not being sold for refurbishing.

These aren't built yet, they are a separate piece of work, but since we are redesigning the whole flow anyway, the plan below is meant to fit together with them. Thats why mentioning them here

*THE POSSIBLE WAYS TO DO IT*

These are few of the ways implement karne ka, again, We don't have to pick just one, they can stack on top of each other.

1. Masked Marketplace (for now)
Instead of the company name we show something like "Verified Producer, Hyderabad, 4.8 stars, 23 deals". The bid has no message box, just price and pickup date. After a bid is accepted they only see first names and arrange pickup through fixed time slots and a few ready-made messages, no open chat. Money is still paid directly between them, so this closes the leaks but doesn't fully lock them in. It's the base we build everything else on, and it doesn't need payments to be ready.

2. Commission on every deal
Same as above, but when a deal closes ScrapKart charges a small commission. Since refurbishers pay much more than recyclers, our cut is bigger on the better deals. Stronger, because now there's money and a record tied to us. Needs basic payment setup.

3. Escrow (Upwork model kinda)
The buyer pays into ScrapKart first, we hold the money, and we release it to the seller once pickup is confirmed by OTP, keeping our commission. Going off-platform means no protection at all. This is the strongest version that still lets them do their own pickup. Needs full payments and KYC.

4. We handle the pickup too (long term goal)
ScrapKart arranges the truck and transport itself, so the buyer and seller may never even meet. Maximum control but a lot of operational work and cost. This is a future goal.


To keep trust even when names are hidden, we show a ScrapKart-verified badge (we check GST / licence / KYC) and a rating with deal history, because 4.8 stars, 23 deals seller is more reassuring to deal with than just a random company name.

*MAIN THINGS WE NEED TO DECIDE*

- How far do we want to go, just hide the details, go all the way to escrow, or eventually handle pickups ourselves too?

- How much commission? and who pays it (buyer, seller, or split between them)?

- Are we okay with hiding the company name? If yes, then are we looking to provide a UID or something?

the flow is yet to be finalized
