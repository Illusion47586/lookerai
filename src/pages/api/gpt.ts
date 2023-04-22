// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

type Data = {
  reply: string;
};

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

const base_msg = String.raw`You are a looker studio expert and know how to create a url which can lead to an explore page the user needs. The url starts with https://headout.looker.com/explore/analytics_reporting/bookings and you only add a query param to this. There are two params, fields and filters. Filters are added as f[<name of the filter>]=<values based on type>.

Here are the filters in json format with description and type
{
    "booking_guests": {
        "guest_type": {
            "description": "It means whether the guest is adult or children",
            "type": "STRING"
        },
        "number_of_guests": {
            "description": "It means how many guest are added to the booking",
            "type": "NUMBER"
        }
    },
    "bookings": {
            "price": {
                "description": "The price that the guest has to pay",
                "type": "NUMBER"
            },
            "price_net": {
                "description": "The price which we have to pay to our vendor/local partner",
                "type": "NUMBER"
            },
            "price_net_usd": {
                "description": "The price which we have to pay to our vendor/local partner in US Dollars",
                "type": "NUMBER"
            },
            "price_payable": {
                "description": "The price which we have to pay to our vendor/local partner",
                "type": "NUMBER"
            },
            "price_payable_usd": {
                "description": "The price which we have to pay to our vendor/local partner in US Dollars",
                "type": "NUMBER"
            }
        ,
        "booking_id": {
            "description": "The unique booking reference number that we give to every booking",
            "type": "NUMBER"
        },
        "booking_status": {
            "description": "This means whether the booking is CANCELLED, PENDING OR COMPLETED",
            "type": "STRING"
        },
        "booking_type": {
            "description": "This means whether the booking is Automated/Manual/Customer Request/Partially Automated",
            "type": "STRING"
        },
        "cancellation_policy": {
            "cancellable_upto": {
                "description": "This means whether the booking cancelable upto 24 hour or 48 hours or 72 hours.",
                "type": "NUMBER"
            },
            "is_cancellable_(yes_/_no)": {
                "description": "It means whether the booking is cancelable or not. If it is canclebale then Yes or else No",
                "type": "STRING"
            }
        },
        "completion_type": {
            "description": "It means whether the booking is Super/Amended/Cancelled By Customer/Cancelled By Vendor/Cancelled Fraudulent /Unfulfilled/Dummy",
            "type": "STRING"
        },
        "created_date": {
            "date": {
                "description": "It tells us on which date the booking was created."
            },
            "hour": {
                "description": "It tells us on which hour the booking was created."
            },
            "month": {
                "description": "It tells us on which month the booking was created."
            },
            "month_name": {
                "description": "It tells us the name of the month on which the booking was created."
            },
            "month_num": {
                "description": "It tells us the number of the month on which the booking was created."
            },
            "quarter": true,
            "time": true,
            "week": true,
            "year": true
        },
        "distribution_partner": {
            "affiliate_code": {
                "description": "An affiliate code is an identification option with which website operators can mark outgoing links"
            },
            "affiliate_commission_usd": {
                "description": "Amount that our affiliate partner will get as commission in USD"
            },
            "is_partner_booking_(yes_/_no)": {
                "description": "It means whether the local partner/supply partner/venue is partnered with us or not. It can be either Yes or No."
            },
            "partner_name": {
                "description": "If gives us the local partner name/supply partner name"
            }
        },
        "event_raw": true,
            "city": {
                "description": "It tells us the city where the customer will be having the experience",
                "type": "STRING"
            },
            "collection_id": {
                "description": "It is a numerical id given to a group of similar experiences",
                "type": "NUMBER"
            },
            "collection_name": {
                "description": "It is a name given to a group of similar experiences",
                "type": "STRING"
            },
            "combined_entity_id": {
                "description": "They're associated with collections or subcategory IDs. If it's a collection, it's a specific POINT OF INTEREST in a specific city, that becomes the combined entity. If it's a subcategory, it's a subcategory + the city it's associated with. Note: We used to use a nomenclature called Experience Collection (EC) earlier. This has since been discontinued and should not be used.",
                "type": "NUMBER"
            },
            "combined_entity_name": {
                "description": "it is the unique name associated with each combined entity id",
                "type": "NUMBER"
            },
            "country": {
                "description": "It tells us the country where the customer will be having the experience",
                "type": "STRING"
            },
            "experience_id": {
                "description": "It is also called TGID/tgid which is an unique id for an experience that is booked by the customer.",
                "type": "NUMBER"
            },
            "experience_name": {
                "description": "It tells us the name of the experience that our customer booked",
                "type": "STRING"
            },
            "language": {
                "description": "It tells customer's language",
                "type": "STRING"
            },
            "primary_category_id": {
                "description": "Is the unique id given as per the Primary Category Name ",
                "type": "NUMBER"
            },
            "primary_category_name": {
                "description": "Categories are broad classifications of experiences. Eg. Tickets, tours, transportation",
                "type": "STRING"
            },
            "sub-category_id": {
                "description": "Is the unique id given as per theSub-Category Name",
                "type": "NUMBER"
            },
            "sub-category_name": {
                "description": " Categories are subdivided into subcategories that list of point of interest under each category",
                "type": "STRING"
            },
            "tour_id": {
                "description": "It must always be associated with a TGID. A TID corresponds to each variant/option on a booking page. The TID is related to merchandising elements of the variant: where the supply comes from, the timings, the inventory, etc.",
                "type": "NUMBER"
            },
            "tour_name": {
                "description": "It is the name give to the variant of the tour",
                "type": "STRING"
            },
            "variant_id": {
                "description": "The Variant ID is also mapped to variants/options. This allows us to link content to the variant. This allows the customer to make an informed decision before making a purchase. Therefore, each variant has a TID and a VID associated to it.",
                "type": "STRING"
            },
            "variant_language": {
                "description": "It is the language for the variant. This means the language that the experience will happen.",
                "type": "STRING"
            },
            "variant_name": {
                "description": "It is the name give to the variant of the experience.",
                "type": "STRING"
            }
        ,
        "experience_start_date": {},
        "fulfilment_details": {“fulfilment_type”: true,
“rms_account_name”: true,
“rms_name”:true,
“vendor_id”:true,
“vendor_name”:true,
},
        "is_seatmap_(yes_/_no)": {
            "description": "It tells us whether a particular venue or exoericne has their seats mapped or not. It can either be Yes or No",
            "type": "STRING"
        },
        "lead_time": {},
        "order_id": {
            "description": "It is also a unique reference number of the booking. it is also called as itinerary_id",
            "type": "NUMBER"
        },
        "primary_guest": {},
        "processing_currency": {
            "description": "code for currency the booking was processed in. This is the currency customer's card is charged in",
            "type": "STRING"
        },
        "wanderfest": {}
    },
    "dim_vendors": {
        "country_iso2_code": {
            "description": "internationally recognized codes that designate every country and most of the dependent areas a two-letter combination or a three-letter combination",
            "type": "STRING"
        },
        "email_opt_out_(yes_/_no)": {
            "description": "It tells us whether the local partner/supply partner/venue has opted out from getting emails. It can either be Yes or No ",
            "type": "STRING"
        },
        "fulfilment_type": {
            "description": "It tells us how the booking will be fulfilled. The booking can be fulfiled as MANUAL/FREESALE/VENDOR_API/VENDOR_REQUEST/BROADWAY_OFFLINE/PRE_PURCHASE/SELENIUM/EXTERNAL_VENDOR_API",
            "type": "STRING"
        },
        "is_partnered_(yes_/_no)": {
            "description": "It means whether the local partner/supply partner/venue is partnered with us or not. It can be either Yes or No. ",
            "type": "STRING"
        },
        "payment_basis": {
            "description": "It means when we will be paying the local partner/supply partner/venue for the experience we booked for our guest. DATE_OF_BOOKING/DATE_OF_EXPERIENCE/DATE_OF_REDEMPTION",
            "type": "STRING"
        },
        "payment_method": {
            "description": "PARTNER_INVOICE/SELF_REPORTING/PARTNER_DEPOSIT/IMMEDIATE/PREPAID/CARD/INVOICE_SP/PORTAL_DEPOSIT/HEADOUT_STANDARD_REPORTING",
            "type": "STRING"
        },
        "supply_partner_billing_entity_id": {
            "description": "It is a unique billing id for every local partner/supply partner/venue. ",
            "type": "NUMBER"
        },
        "vendor_id": {
            "description": "It is an unique id to identify our local partner/supply partner/venue",
            "type": "NUMBER"
        },
        "vendor_name": {
            "description": "Is is the unique name of each our local partner/supply partner/venue",
            "type": "STRING"
        }
    },
    "timeline_comparison_fields": {
        "current_period_date": true,
        "day_in_period": true,
        "period": true
    }
}
do not use any complex or advanced operators.`;

const next_msg = String.raw`here are a few examples:
prompt, completion
"Give me the booking id, vendor names and booking type for the last 30 days where vendor id 1931","https://headout.looker.com/explore/analytics_reporting/bookings?fields=bookings.booking_id,bookings.vendor_name,bookings.booking_type&f[bookings.completion_type]=-Cancelled+Fraudulent,-Dummy&f[bookings.experience_id]=-10481,-10482,-10483,-10493&f[bookings.created_date]=30+days+ago+for+30+days&f[bookings.booking_status]=-Uncaptured,-Dummy&f[bookings.vendor_id]=1931&sorts=bookings.vendor_name&limit=500&column_limit=50&query_timezone=Asia/Calcutta"
"Give me Experience name, booking ids, booking type  for the last 7 days where booking status is Pending","https://headout.looker.com/explore/analytics_reporting/bookings?fields=bookings.booking_id,bookings.vendor_name,bookings.booking_type,bookings.experience_name&f[bookings.completion_type]=-Cancelled+Fraudulent,-Dummy&f[bookings.experience_id]=-10481,-10482,-10483,-10493&f[bookings.created_date]=7+days+ago+for+7+days&f[bookings.booking_status]=Pending,-Uncaptured,-Dummy&sorts=bookings.vendor_name&limit=500&column_limit=50&query_timezone=Asia/Calcutta"
"Give me Experience name, booking ids, booking type for the last 7 days where booking status is Pending and has seatmap","https://headout.looker.com/explore/analytics_reporting/bookings?fields=bookings.booking_id,bookings.vendor_name,bookings.booking_type,bookings.experience_name&f[bookings.completion_type]=-Cancelled+Fraudulent,-Dummy&f[bookings.experience_id]=-10481,-10482,-10483,-10493&f[bookings.created_date]=7+days+ago+for+7+days&f[bookings.booking_status]=Pending,-Uncaptured,-Dummy&f[bookings.is_seatmap]=Yes&sorts=bookings.vendor_name&limit=500&column_limit=50&query_timezone=Asia/Calcutta"
"Give me Experience name, booking ids, booking type for the last 7 days where there is no seatmap","https://headout.looker.com/explore/analytics_reporting/bookings?fields=bookings.booking_id,bookings.vendor_name,bookings.booking_type,bookings.experience_name&f[bookings.completion_type]=-Cancelled+Fraudulent,-Dummy&f[bookings.experience_id]=-10481,-10482,-10483,-10493&f[bookings.created_date]=7+days+ago+for+7+days&f[bookings.booking_status]=-Uncaptured,-Dummy&f[bookings.is_seatmap]=No&sorts=bookings.vendor_name&limit=500&column_limit=50&query_timezone=Asia/Calcutta"
Booking ids that were pending or completed and has not been cancelled for Experience id 10048 between 7th feb 2022 to 31st december 2022.,"https://headout.looker.com/explore/analytics_reporting/bookings?fields=bookings.booking_id,bookings.created_date,bookings.experience_start_date,bookings.experience_name,bookings.tour_id,bookings.tour_name,bookings.completion_type&f[bookings.booking_status]=Pending,Completed,-Cancelled&f[bookings.completion_type]=-Cancelled+Fraudulent,-Dummy,-Unfulfilled,-Cancelled+By+Customer,-Cancelled+By+Vendor&f[bookings.created_date]=&f[bookings.experience_id]=10048&f[bookings.experience_start_date]=2022/02/07+to+2022/12/31&limit=500&query_timezone=UTC&vis={}"
all pending and completed bookings for 13th april for TID 13667,"https://headout.looker.com/explore/analytics_reporting/bookings?fields=bookings.booking_id,bookings.experience_id,bookings.experience_name,bookings.tour_id,bookings.tour_name,bookings.experience_start_date,bookings.experience_start_time,bookings.completion_type,bookings.language,bookings.primary_guest_name,bookings.primary_guest_email,bookings.vendor_id,bookings.primary_guest_number&f[bookings.booking_status]=Completed,Pending&f[bookings.completion_type]=-Cancelled+Fraudulent,-Dummy,-Cancelled+By+Customer,-Cancelled+By+Vendor,-Unfulfilled&f[bookings.created_date]=&f[bookings.experience_id]=-EMPTY&f[bookings.experience_start_date]=2023/04/13&f[bookings.tour_id]=13667&sorts=bookings.experience_start_time&limit=500&column_limit=50&query_timezone=UTC"
All the TGIDs for vendor id 1813,"https://headout.looker.com/explore/analytics_reporting/bookings?fields=bookings.experience_name,bookings.experience_id,bookings.count_bookings,bookings.city&f[bookings.booking_status]=-Uncaptured,-Dummy&f[bookings.completion_type]=-Cancelled+Fraudulent,-Dummy&f[bookings.experience_id]=-10481,-10482,-10483,-10493&f[bookings.created_date]=90+days&f[bookings.vendor_id]=1813&sorts=bookings.city+desc&limit=500&query_timezone=America/New_York"
All the bookings that were cancelled fraudulent for the bookings created in the past 30 days,"https://headout.looker.com/explore/analytics_reporting/bookings?fields=bookings.booking_id,bookings.created_date,bookings.experience_start_date,bookings.experience_name,bookings.tour_id,bookings.tour_name,bookings.completion_type&f[bookings.booking_status]=Cancelled,-Pending,-Completed&f[bookings.completion_type]=Cancelled+Fraudulent&f[bookings.created_date]=30+days&f[bookings.experience_id]=&f[bookings.experience_start_date]=&limit=500&query_timezone=UTC"
All the TIDS for TGID 19873,"https://headout.looker.com/explore/analytics_reporting/bookings?fields=bookings.tour_id&f[bookings.booking_status]=Pending,Completed,-Cancelled&f[bookings.completion_type]=-Cancelled+Fraudulent,-Cancelled+By+Customer,-Cancelled+By+Vendor,-Dummy,-Unfulfilled&f[bookings.created_date]=&f[bookings.experience_id]=19873&f[bookings.experience_start_date]=&sorts=bookings.tour_id&limit=500&column_limit=50&query_timezone=UTC"
All the tour names for TGID 19873,"https://headout.looker.com/explore/analytics_reporting/bookings?fields=bookings.tour_id,bookings.tour_name&f[bookings.booking_status]=Pending,Completed,-Cancelled&f[bookings.completion_type]=-Cancelled+Fraudulent,-Cancelled+By+Customer,-Cancelled+By+Vendor,-Dummy,-Unfulfilled&f[bookings.created_date]=&f[bookings.experience_id]=19873&f[bookings.experience_start_date]=&sorts=bookings.tour_id&limit=500&column_limit=50&query_timezone=UTC"`;

// ft-5SVSss52W1vzYQYkVuOeSGLo

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { query } = req.query;
  const response = await openai.createCompletion({
    prompt: query,
    model: "davinci:ft-personal-2023-04-22-18-37-13",
    temperature: 0.1,
    max_tokens: 200,
    presence_penalty: 0.5,
  });
  let reply: string;
  if (response.status >= 200 && response.status <= 300) {
    reply = response.data.choices[0].text ?? "nothing found";
  } else reply = response.statusText;
  console.log(response.data);

  // const response = await openai.createChatCompletion({
  //   messages: [
  //     { role: "user", content: base_msg },
  //     { role: "assistant", content: "understood" },
  //     { role: "user", content: next_msg },
  //     { role: "user", content: `headout looker url for ${query as string}` },
  //   ],
  //   model: "gpt-3.5-turbo",
  //   temperature: 0.2,
  //   max_tokens: 500,
  // });
  // console.log(response.data.choices);
  res.status(200).json({ reply });
}
