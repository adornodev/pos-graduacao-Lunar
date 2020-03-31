using System;
using System.IO;
using Infra.Functions;
using InfraFunctions.Helpers;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;

namespace ModelExecutionFunc
{
    public static class ModelExecutionFunc
    {
        [FunctionName("ModelExecutionFunc")]
        public static void Run([BlobTrigger("raw-data/{name}", Connection = "")]Stream myBlob, string name, string BlobTrigger, ILogger log, ExecutionContext context)
        {
            // StreamReader reader = new StreamReader(myBlob);
            // string content = reader.ReadToEnd();
            log.LogInformation($"C# Blob trigger function Processed blob\n Name:{name} \n Size: {myBlob.Length} Bytes");

            try
            {
                // Initialize function configurations
                var config = Initialization.GetAppConfiguration(context);
                Initialization.InitializeFunctionConfig(config, context);

                // Initialize logger
                var _logger = Initialization.InitializeLoggerManager(config);

                //_logger.LogInfo("Teste");
                //_logger.LogWarn("Teste");
                //_logger.LogError("Teste");
            }
            catch(Exception ex)
            {
                log.LogError($"[ModelExecutionFunc] Error Message: {ex.Message}\tStackTrace: {ex.StackTrace}");
            }
            
        }
    }
}
