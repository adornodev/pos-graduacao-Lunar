using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infra.Functions
{
    public class FunctionConfig : IConfiguration
    {
        public static string ConnectionString = "Server=bskpdmdb.postgres.database.azure.com;Database=pdmdb;Port=5432;User Id=pdmdbadmin@bskpdmdb;Password=Br@sk3mPdmCtT1m3sc@L3;Ssl Mode=Require;Command Timeout=180;";
        public static string Environment = "dev";
        public static string SbConnectionString;
        public static string HeimdallUrl;
        public static string InvocationId;
        public string this[string key]
        {
            get
            {
                switch (key)
                {
                    case "Env":
                        return Environment;
                    case "Heimdall:Url":
                        return HeimdallUrl;
                    case "Heimdall:UpCode":
                        return HeimdallUpCode;
                    case "Heimdall:DownCode":
                        return HeimdallDownCode;
                    case "InvocationId":
                        return InvocationId;
                    default:
                        return ConnectionString;
                }

            }
            set => throw new NotImplementedException();
        }

        public static string HeimdallUpCode;

        public static string HeimdallDownCode;

        public IEnumerable<IConfigurationSection> GetChildren()
        {
            throw new NotImplementedException();
        }

        public Microsoft.Extensions.Primitives.IChangeToken GetReloadToken()
        {
            throw new NotImplementedException();
        }

        public IConfigurationSection GetSection(string key)
        {
            throw new NotImplementedException();
        }
    }
}