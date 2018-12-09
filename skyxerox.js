const fetch = require('node-fetch');
const util = require('util');
const n_geocoder = require('node-geocoder');
const _ = require('lodash');

const options = {
	provider: 'google',
}
const geocoder = n_geocoder(options);

const ALL_ENDPOINT = 'https://www.skyscanner.net/g/browseservice/dataservices/browse/v3/bvweb/UK/GBP/en-GB/destinations/%s/%s/%s/%s/?apikey=8aa374f4e28e4664bf268f850f767535';
const ROLLED_ENDPOINT = 'https://www.skyscanner.net/g/browseservice/dataservices/browse/v3/bvweb/UK/GBP/en-GB/destinations/%s/%s/%s/%s/?profile=minimalcityrollupwithnamesv2&apikey=8aa374f4e28e4664bf268f850f767535';
const SUGGEST_ENDPOINT= 'https://www.skyscanner.net/g/autosuggest-flights/UK/en-GB/%s?IsDestination=%s&enable_general_search_v2=true';
const STORE_ENDPOINT = 'https://www.skyscanner.net/transport/flights/%s/%s/%s/%s/?adults=1&children=0&adultsv2=1&childrenv2=&infants=0&cabinclass=economy&rtn=1&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false&ref=home#results'

const fetchWithHeaders = (url) => {
	const headers = {
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'Accept-Encoding': 'gzip, deflate, br',
		'Accept-Language': 'en-GB,en;q=0.5',
		'Cache-Control': 'max-age=0',
		'Connection': 'keep-alive',
		'Cookie': "traveller_context=dcc704f0-ef72-41b0-9e81-08715b931a62; ssculture=locale:::en-GB&market:::UK&currency:::GBP; gdpr=optin:::true&version:::2&information:::true&adverts:::true; experiment_allocation_id=55bb0a23014816c1ddb6ca0d36fcd5009c655b26d7b8370d74123103183b3696; ssab=AAExperiment_V8:::a&ABS_AAHome_V2:::a&ABS_AAUK_V2:::b&ABS_AAUK_AllLocales_V2:::b&ABS_AAenGB_V2:::b&Ads_Show_CPM_Ribbon_V4:::b&AfsKeywordsSelection_V1:::b&DEAL_Default_To_Two_Guests_V3:::b&FLUX787_QuoteBlacklist_V2:::a&FLUX_GDT2791_SendPriceTraceToMixpanel_V6:::b&HFE_SocialValidation_V2:::b&Hfe_OfficialPartner_It2_V2:::b&Hfe_PricePerNight_V2:::b&OTR_ImageShare_UseDeepLinkGenerator_V9:::on&PIE_Price_Alert_Threshold_H2_V6:::b&Rail_Switch_Ctrip_API_V2_V2:::on&TCS_Send_Searching_Email_V4:::b&Trex_DirectDays_Web_V21:::b&afs_style_experiment_desktop_V2:::b&atbt___noSecondarySearchRedirect_V6:::b&change_optional_extra_title_V10:::a&dbook_basi_trafficcontrol_web_V1:::a&dbook_blua_trafficcontrol_web_V4:::a&dbook_drag_trafficcontrol_all_web_V2:::a&dbook_flot_trafficcontrol_V12:::a&dbook_hhk__trafficcontrol_web_V4:::a&dbook_sexp_trafficcontrol_web_V5:::a&dbook_silk_trafficcontrol_web_additional_V3:::a&dbook_sing_trafficcontrol_web_additional_V4:::a&dbook_sune_trafficcontrol_web_V4:::a&fbw_dbook_to_pbook_switcher_V5:::b&fps_lus_client_quote_service_split_traffic_V225:::b&fps_lus_mag_coverage_measure_V4:::enabled&fps_lus_qss_automatic_rules_V19:::a&fps_lus_quote_service_split_quote_pipeline_V68:::qps&fps_lus_send_quotes_to_slipstream_V25:::noexperiment&fps_mbmd_V11:::b&fps_quoteretrieval_aws_V115:::aws&fps_remove_monetizedlink_check_V2:::b&fps_route_summary_traffic_shift_V6:::b&freeag_pqs_hotels_carousel_V8:::b&fss_Fare_Policy_Global_2_V6:::c&pel_use_website_link_data_V10:::b&rts_wta_shadowtraffic_V400:::b&terra_artemis_conductor_V23:::a&woo_quote_cache_redirects_V5:::a; device_guid=0b95662a-db8a-43d2-a46b-aada1cafff5f; scanner=currency:::GBP&legs:::LOND|2018-12-15|CDG|CDG|2018-12-15|SIN&adultsV2:::1&childrenV2&from:::LHR&to:::NOC&fromCy:::UK&toCy:::UK&oym:::1812&oday:::13&wy:::0&tripType:::return&iym:::1812&iday:::20&cabinclass:::Economy&preferDirects&adults:::1&fromName:::London&toName:::Edinburgh&rtn:::1; _pxCaptcha=eyJyIjoiMDNBTzlaWTFEelJCZllQaEkzZ2tBcEt1REl3S3RWY19TalhORXQzMlZoNk1YMVhyb0E2cFEwQkFOMGhMUTBjSkVERlQybWJvaWxIcmg2WjlFU0VRcnh5NmREU3ltSXJpLUw4Ynd5UmR4Z3BWT3l3SlliZWVCUkxFUnRwdkdrUmRtZnRlY01vZ1lDR2dKdjZTLTdxTHZUTk0xeEtVZGpPaUlVNkh6cWxQSEdxVkt2Ui00QmZNWUVPSEJvSGg0SllxRWVjTjd4NjRDaUFIdFZqaC1oNjNpeDlId29VcjZRZHNtejdiQ1Uzd21TTmttVmg0TGpUdVRrSV9TUXdNYWNMY2RLeHRuTDZOaFlZOXlUSWh6X3JzQmRGR0RPS2ppbUlTTEExUSIsInUiOiI4Y2UzOWM0MC1mYjgxLTExZTgtYjQ0ZC0zYmQwODU1Yzg0ZTIiLCJ2IjoiIn0=; preferences=dcc704f0ef7241b09e8108715b931a62",
		'Host': 'www.skyscanner.net',
		'Upgrade-Insecure-Requests': '1',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:65.0) Gecko/20100101 Firefox/65.0',
	};
	return fetch(url, {
		method: 'GET',
		headers: headers
	});
};

const promiseGeocode = (addr) => {
	return new Promise((resolve, reject) => {
		geocoder.geocode(addr, (err, res) => {
			console.log(err);
			if (err) reject(err);
			else resolve(res);
		});
	});
}

const getDestinationList = async (source, dest, outbound, inbound, direct) => {
	if (!dest) dest = "anywhere";
	let data = await fetchWithHeaders(util.format(ROLLED_ENDPOINT, source, dest, outbound, inbound)).then(res => res.json());
	console.log(data);
	let prices = data.PlacePrices.filter(x => x.DirectPrice > 0 || x.IndirectPrice > 0);
	if (direct) prices = prices.filter(x => x.DirectPrice != null && x.DirectPrice != 0).map(x => {x.Price = x.DirectPrice; x.Direct = true; return x;});
	else prices = prices.map(x => {
		if (x.DirectPrice != null && x.DirectPrice != 0) { x.Price = x.DirectPrice; x.Direct = true; }
		if (x.IndirectPrice != null && x.IndirectPrice != 0 && (x.Price == null || (x.Price > x.IndirectPrice))) { x.Price = x.IndirectPrice; x.Direct = false; }
		return x;
	});
	prices = prices.sort((a, b) => a.Price - b.Price);
	return prices;
}

const getDetailedDestinationData = async (source, dest, outbound, inbound) => {
	/* outbound, inbound as YYYY-MM-DD */
	if (!dest) dest = "anywhere";
	let data = await fetchWithHeaders(util.format(ALL_ENDPOINT, source, dest, outbound, inbound)).then(res => res.json());
	return data;
}

const getPlaceSuggestions = async (input) => {
	/* assume not destination */
	let data = await fetchWithHeaders(util.format(SUGGEST_ENDPOINT, input)).then(res => res.json());
	return data.map(x => {
		return {name: x.PlaceName + ", " + x.CountryName, id: x.PlaceId, location: x.Location}
	});
}

const translateDateString = (date) => {
	return date.substr(2, 2) + date.substr(5, 2) + date.substr(8, 2);
}

const intersect = async (srcA, srcB, outbound, inbound) => {
	/* match pairs */
	let ret = [];
	let dataA = (await getDestinationList(srcA, null, outbound, inbound)).slice(0, 10);
	let dataB = (await getDestinationList(srcB, null, outbound, inbound)).slice(0, 10);

	/* get individual city info */
	dataA = [].concat.apply([], await Promise.all(dataA.map(async x => {
		return await getDestinationList(srcA, x.Id, outbound, inbound);
	})));
	dataB = [].concat.apply([], await Promise.all(dataB.map(async x => {
		return await getDestinationList(srcB, x.Id, outbound, inbound);
	})));
	let match = {};
	dataA.forEach(x => {
		if (x.Price == 0) return;
		match[x.Id] = x.Price;
	});
	await Promise.all(dataB.map(async y => {
		if (y.Price == 0) return;
		if (!match[y.Id]) return;
		let loc = await promiseGeocode(y.Name);
		ret.push({
			priceA: match[y.Id],
			priceB: y.Price,
			buyA: util.format(STORE_ENDPOINT, srcA.toLowerCase(), y.Id.toLowerCase(), translateDateString(outbound), translateDateString(inbound)),
			buyB: util.format(STORE_ENDPOINT, srcB.toLowerCase(), y.Id.toLowerCase(), translateDateString(outbound), translateDateString(inbound)),
			totalPrice: y.Price + match[y.Id],
			id: y.Id,
			name: y.Name,
			lat: loc[0].latitude,
			lng: loc[0].longitude,
			location: loc[0].latitude + ', ' + loc[0].longitude
		});
	}));
	ret = ret.sort((x, y) => x.totalPrice - y.totalPrice).slice(0, 20);
	return ret;
}

module.exports = {intersect, getPlaceSuggestions, getDestinationList, getDetailedDestinationData, getPlaceSuggestions};
