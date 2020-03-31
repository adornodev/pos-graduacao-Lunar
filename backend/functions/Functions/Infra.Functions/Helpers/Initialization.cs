using Infra.Functions;
using Infra.Functions.Helpers;
using Logzio.DotNet.NLog;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Configuration;
using NLog;
using NLog.Config;

namespace InfraFunctions.Helpers
{
    public static class Initialization
    {
        public static IConfigurationRoot GetAppConfiguration(ExecutionContext context) => new ConfigurationBuilder()
                             .SetBasePath(context.FunctionAppDirectory)
                             .AddEnvironmentVariables()
                             .Build();

        public static void InitializeFunctionConfig(IConfigurationRoot config, ExecutionContext context)
        {
            var env = config["Environment"];
            var dbConnString = config["DatabaseConnectionString"];
            var sbConnString = config["OutServiceBusConnectionString"];
            FunctionConfig.Environment = env;
            FunctionConfig.ConnectionString = dbConnString;
            FunctionConfig.SbConnectionString = sbConnString;
            FunctionConfig.InvocationId = context.InvocationId.ToString();
        }

        public static LoggerManager InitializeLoggerManager(IConfigurationRoot config)
        {
            var env = config["Environment"];

            SetLogConfiguration(env);

            return new LoggerManager();
        }

        public static void SetLogConfiguration(string env)
        {
            var logConfig = new LoggingConfiguration();
            var logzioTarget = new LogzioTarget
            {
                Token = "QuIPlayfEKCBdJTQYqzXBuzSrpcxobsJ",
            };
            logConfig.AddTarget("Logzio", logzioTarget);

            if (env == "prod")
            {
                logConfig.AddRule(LogLevel.Info, LogLevel.Fatal, "Logzio", "*");
            }
            else
            {
                logConfig.AddRule(LogLevel.Debug, LogLevel.Fatal, "Logzio", "*");
            }

            LogManager.Configuration = logConfig;

        }
    }
}
