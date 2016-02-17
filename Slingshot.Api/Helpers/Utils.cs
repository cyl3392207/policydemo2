﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Slingshot.Models;

namespace Slingshot.Helpers
{
    public class Utils
    {
        public class ResultOf<T>
        {
            public T[] value { get; set; }
        }

        public class ArmResource<T>
        {
            public string id { get; set; }
            public string name { get; set; }
            public string type { get; set; }
            public string kind { get; set; }
            public string location { get; set; }
            public object tags { get; set; }
            public string plan { get; set; }
            public T properties { get; set; }
        }

        public enum AzureEnvs
        {
            Next = 0,
            Current = 1,
            Dogfood = 2,
            Prod = 3
        }

        public static async Task<SourceControlInfo> GetSourceControlAsync(string host, string token, string scm)
        {
            var url = string.Format("{0}/providers/Microsoft.Web/sourceControls/{1}?api-version={2}", Utils.GetCSMUrl(host), scm, Constants.CSM.ApiVersion);
            using (var client = CreateHttpClient(token))
            using (var response = await client.GetAsync(url))
            {
                return (await ProcessResponse<ArmResource<SourceControlInfo>>("GetSourceControlAsync", response)).properties;
            }
        }

        public static async Task<SubscriptionInfo[]> GetSubscriptionsAsync(string host, string token)
        {
            var url = string.Format("{0}/subscriptions?api-version={1}", Utils.GetCSMUrl(host), Constants.CSM.ApiVersion);
            using (var client = CreateHttpClient(token))
            using (var response = await client.GetAsync(url))
            {
                ResultOf<SubscriptionInfo> result = await ProcessResponse<ResultOf<SubscriptionInfo>>("GetSubscriptionsAsync", response);
                var subs = result.value;

                var getRgTasks = new List<Task<ResourceGroupInfo[]>>();
                foreach (var sub in subs)
                {
                    getRgTasks.Add(GetResourceGroups(client, host, sub.subscriptionId));
                }

                var rgsForAllSubs = await Task.WhenAll(getRgTasks.ToArray());
                for (int i = 0; i < rgsForAllSubs.Length; i++)
                {
                    subs[i].resourceGroups = rgsForAllSubs[i];
                }

                return subs;
            }
        }

        public static async Task<HttpResponseMessage> Execute(Task<HttpResponseMessage> task)
        {
            var watch = new Stopwatch();
            watch.Start();
            var response = await task;
            watch.Stop();
            response.Headers.Add(Constants.Headers.X_MS_Ellapsed, watch.ElapsedMilliseconds + "ms");
            return response;
        }

        public static string GetCSMUrl(string host)
        {
            if (host.EndsWith(".antares-int.windows-int.net", StringComparison.OrdinalIgnoreCase))
            {
                return "https://api-next.resources.windows-int.net";
            }
            else if (host.EndsWith(".antares-test.windows-int.net", StringComparison.OrdinalIgnoreCase))
            {
                return "https://api-current.resources.windows-int.net";
            }
            else if (host.EndsWith(".ant-intapp.windows-int.net", StringComparison.OrdinalIgnoreCase))
            {
                return "https://api-dogfood.resources.windows-int.net";
            }

            return "https://management.azure.com";
        }

        public static string GetRDFEUrl(string host)
        {
            if (host.EndsWith(".antares-int.windows-int.net", StringComparison.OrdinalIgnoreCase))
            {
                return "https://umapinext.rdfetest.dnsdemo4.com";
            }
            else if (host.EndsWith(".antares-test.windows-int.net", StringComparison.OrdinalIgnoreCase))
            {
                return "https://umapi.rdfetest.dnsdemo4.com";
            }
            else if (host.EndsWith(".ant-intapp.windows-int.net", StringComparison.OrdinalIgnoreCase))
            {
                return "https://umapi-preview.core.windows-int.net";
            }

            return "https://management.core.windows.net";
        }

        private static async Task<ResourceGroupInfo[]> GetResourceGroups(
            HttpClient client,
            string host,
            string subscriptionId)
        {
            string url = string.Format(
                "{0}/subscriptions/{1}/resourceGroups?api-version={2}",
                Utils.GetCSMUrl(host),
                subscriptionId,
                Constants.CSM.ApiVersion);

            using (var response = await client.GetAsync(url))
            {
                if (response.IsSuccessStatusCode)
                {
                    return (await response.Content.ReadAsAsync<ResultOf<ResourceGroupInfo>>()).value;
                }

                var content = await response.Content.ReadAsStringAsync();
                if (content.StartsWith("{"))
                {
                    var error = (JObject)JObject.Parse(content)["error"];
                    if (error != null)
                    {
                        throw new InvalidOperationException(String.Format("GetResourceGroups {0}, {1}", response.StatusCode, error.Value<string>("message")));
                    }
                }

                throw new InvalidOperationException(String.Format("GetResourceGroups {0}, {1}", response.StatusCode, await response.Content.ReadAsStringAsync()));

            }
        }

        private static HttpClient CreateHttpClient(string token)
        {
            var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            return client;
        }

        private static async Task<T> ProcessResponse<T>(string operation, HttpResponseMessage response)
        {
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsAsync<T>();
            }

            var content = await response.Content.ReadAsStringAsync();
            if (content.StartsWith("{"))
            {
                var error = (JObject)JObject.Parse(content)["error"];
                if (error != null)
                {
                    throw new InvalidOperationException(string.Format(
                        CultureInfo.InvariantCulture,
                        "{0} {1}, {2}", operation, response.StatusCode, error.Value<string>("message")));
                }
            }

            throw new InvalidOperationException(string.Format(
                CultureInfo.InvariantCulture,
                "{0} {1}, {2}", operation, response.StatusCode, content));
        }
    }
}