﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Slingshot.Models
{
    public class DeploymentNotificationInputs
    {
        public string siteUrl { get; set; }
        public DeployInputs deployInputs { get; set; }
    }
}